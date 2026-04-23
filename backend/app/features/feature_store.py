"""
Feature store — Redis removed. All reads/writes go directly to PostgreSQL.
Browser-side 30-min TTL handles session freshness.
"""
from datetime import datetime
from typing import Optional, Dict, Any

from sqlalchemy.orm import Session

from app.config.settings import settings
from app.db.session import SessionLocal
from app.db.models import Feature


class FeatureStore:

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
            return feature_row.values if feature_row else None
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
            return feature_row.values if feature_row else None
        finally:
            if close_db:
                db.close()

    # =========================
    # Invalidate (no-op — browser handles TTL)
    # =========================
    def invalidate_cache(self, user_id: str):
        pass  # Cache lives in browser localStorage, not server-side