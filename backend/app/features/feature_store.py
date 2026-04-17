import json
from datetime import datetime
from typing import Optional, Dict, Any

import redis
from sqlalchemy.orm import Session

from app.config.settings import settings
from app.db.postgres import SessionLocal
from app.db.models import Feature  # make sure this model exists

class FeatureStore:
    def __init__(self):
        # Redis client (optional but recommended)
        self.redis_client = redis.Redis.from_url(
            settings.REDIS_URL,
            decode_responses=True
        )

    # =========================
    # Redis Helpers
    # =========================
    def _redis_key(self, user_id: str) -> str:
        return f"features:{user_id}"

    def _cache_features(self, user_id: str, features: Dict[str, Any]):
        try:
            self.redis_client.set(
                self._redis_key(user_id),
                json.dumps(features),
                ex=3600  # 1 hour TTL
            )
        except Exception:
            pass  # fail silently

    def _get_cached_features(self, user_id: str) -> Optional[Dict[str, Any]]:
        try:
            data = self.redis_client.get(self._redis_key(user_id))
            if data:
                return json.loads(data)
        except Exception:
            return None

        return None

    # =========================
    # Store Features
    # =========================
    def store_features(
        self,
        user_id: str,
        features: Dict[str, Any],
        window_start: Optional[datetime] = None,
        window_end: Optional[datetime] = None,
        db: Optional[Session] = None
    ):
        close_db = False

        if db is None:
            db = SessionLocal()
            close_db = True

        try:
            feature_row = Feature(
                user_id=user_id,
                computed_at=datetime.utcnow(),
                window_start=window_start,
                window_end=window_end,
                feature_version=settings.FEATURE_VERSION,
                values=features
            )

            db.add(feature_row)
            db.commit()

            # Cache in Redis
            self._cache_features(user_id, features)

        finally:
            if close_db:
                db.close()

    # =========================
    # Get Latest Features
    # =========================
    def get_latest_features(
        self,
        user_id: str,
        db: Optional[Session] = None
    ) -> Optional[Dict[str, Any]]:

        # 1. Try Redis first
        cached = self._get_cached_features(user_id)
        if cached:
            return cached

        close_db = False

        if db is None:
            db = SessionLocal()
            close_db = True

        try:
            feature_row = (
                db.query(Feature)
                .filter(Feature.user_id == user_id)
                .order_by(Feature.computed_at.desc())
                .first()
            )

            if not feature_row:
                return None

            features = feature_row.values

            # Cache result
            self._cache_features(user_id, features)

            return features

        finally:
            if close_db:
                db.close()

    # =========================
    # Get Features for Window
    # =========================
    def get_features_for_window(
        self,
        user_id: str,
        start: datetime,
        end: datetime,
        db: Optional[Session] = None
    ) -> Optional[Dict[str, Any]]:

        close_db = False

        if db is None:
            db = SessionLocal()
            close_db = True

        try:
            feature_row = (
                db.query(Feature)
                .filter(Feature.user_id == user_id)
                .filter(Feature.window_start >= start)
                .filter(Feature.window_end <= end)
                .order_by(Feature.computed_at.desc())
                .first()
            )

            if not feature_row:
                return None

            return feature_row.values

        finally:
            if close_db:
                db.close()

    # =========================
    # Invalidate Cache
    # =========================
    def invalidate_cache(self, user_id: str):
        try:
            self.redis_client.delete(self._redis_key(user_id))
        except Exception:
            pass