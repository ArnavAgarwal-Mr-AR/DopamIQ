from app.pipelines.ingestion import load_viewing_activity
from app.pipelines.processing import normalize_events
from app.pipelines.sessionization import create_sessions

from app.features.feature_builder import build_features
from app.features.feature_normalizer import normalize_features

from app.scoring.scoring_engine import compute_scores
from app.prediction.predictor import predict


import io

def run_pipeline(file_obj: io.BytesIO, user_id: str, file_hash: str = None, file_size: float = 0.0):
    """
    End-to-end pipeline:
    Raw → Events → Sessions → Features → Scores → Predictions
    """

    # Ensure synchronous timestamp so the relational Job tracking exactly identically anchors the records
    from datetime import datetime
    sync_timestamp = datetime.utcnow()

    # =========================
    # 1. Ingestion
    # =========================
    df = load_viewing_activity(file_obj)

    # =========================
    # 2. Normalize Events
    # =========================
    events = normalize_events(df, user_id)

    # =========================
    # 3. Sessionization
    # =========================
    sessions = create_sessions(events)

    if not sessions:
        return {
            "error": "No valid sessions found"
        }

    # =========================
    # 4. Feature Engineering
    # =========================
    raw_features = build_features(sessions)

    # =========================
    # 5. Feature Normalization
    # =========================
    features = normalize_features(raw_features)

    # =========================
    # 6. Scoring
    # =========================
    scores = compute_scores(features)

    # =========================
    # 7. Prediction
    # =========================
    predictions = predict(scores, features)

    # =========================
    # 8. Meta Metrics
    # =========================
    from app.meta.predictability import compute_predictability
    from app.meta.susceptibility import compute_susceptibility
    from app.meta.drift import compute_drift

    predictability_score = compute_predictability(events, sessions)
    susceptibility_score = compute_susceptibility(features)
    drift_score = compute_drift(features, features) # using static anchor locally

    meta_payload = {
        "predictability": predictability_score,
        "susceptibility": susceptibility_score,
        "drift": drift_score
    }

    # =========================
    # 9. Database Persistence
    # =========================
    try:
        from app.db.session import SessionLocal
        from app.db.models import Event, Session as SessionModel, Feature, Score, Prediction, MetaMetrics, Job
        
        db = SessionLocal()
        
        # 1. Save Events
        db_events = []
        for e in events:
            db_events.append(Event(
                user_id=user_id,
                timestamp=e["timestamp"],
                event_type=e["event_type"],
                title=e["title"],
                duration=e.get("duration", 0.0),
                device=e.get("device", ""),
                event_metadata=e.get("event_metadata", {})
            ))
        db.add_all(db_events)
        
        # 2. Save Sessions
        db_sessions = []
        for s in sessions:
            db_sessions.append(SessionModel(
                session_id=s["session_id"],
                user_id=user_id,
                start_time=s["start_time"],
                end_time=s["end_time"],
                total_duration=s["duration"],
                num_titles=s["num_titles"],
                binge_flag=s["binge_flag"]
            ))
        db.add_all(db_sessions)
        
        # 3. Save Features
        db_feature = Feature(
            user_id=user_id,
            computed_at=sync_timestamp,
            values=features
        )
        db.add(db_feature)
        
        # 4. Save Scores
        db_score = Score(
            user_id=user_id,
            computed_at=sync_timestamp,
            discipline=float(scores.get("discipline", 0.0)),
            focus=float(scores.get("focus", 0.0)),
            curiosity=float(scores.get("curiosity", 0.0)),
            consistency=float(scores.get("consistency", 0.0)),
            impulsivity=float(scores.get("impulsivity", 0.0))
        )
        db.add(db_score)
        
        # 5. Save Predictions
        db_prediction = Prediction(
            user_id=user_id,
            computed_at=sync_timestamp,
            click_probability=float(predictions.get("click_probability", 0.0)),
            abandonment_probability=float(predictions.get("abandonment_probability", 0.0)),
            binge_probability=float(predictions.get("binge_probability", 0.0)),
            expected_duration=float(predictions.get("expected_duration", 0.0))
        )
        db.add(db_prediction)
        
        # 6. Save Meta
        db_meta = MetaMetrics(
            user_id=user_id,
            computed_at=sync_timestamp,
            predictability=float(meta_payload.get("predictability", 0.0)),
            drift=float(meta_payload.get("drift", 0.0)),
            susceptibility=float(meta_payload.get("susceptibility", 0.0))
        )
        db.add(db_meta)

        # 7. Anchor Analytical Job Tracker Mapping
        if file_hash:
            db_job = Job(
                user_id=user_id,
                file_hash=file_hash,
                file_size_bytes=file_size,
                status="completed",
                total_events=len(events),
                total_sessions=len(sessions),
                score_computed_at=sync_timestamp, 
                created_at=sync_timestamp
            )
            db.add(db_job)

        db.commit()
    except Exception as e:
        print(f"Error persisting pipeline data to DB: {e}")
    finally:
        db.close()


    return {
        "features": features,
        "scores": scores,
        "predictions": predictions
    }
