from app.pipelines.ingestion import load_viewing_activity
from app.pipelines.processing import normalize_events
from app.pipelines.sessionization import create_sessions

from app.features.feature_builder import build_features
from app.features.feature_normalizer import normalize_features

from app.scoring.scoring_engine import compute_scores
from app.prediction.predictor import predict


def run_pipeline(file_path: str, user_id: str):
    """
    End-to-end pipeline:
    Raw → Events → Sessions → Features → Scores → Predictions
    """

    # =========================
    # 1. Ingestion
    # =========================
    df = load_viewing_activity(file_path)

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

    return {
        "features": features,
        "scores": scores,
        "predictions": predictions
    }