from app.features.feature_store import FeatureStore
from app.scoring.scoring_engine import compute_scores
from app.prediction.predictor import predict

feature_store = FeatureStore()


def get_predictions(user_id: str):
    features = feature_store.get_latest_features(user_id)

    if not features:
        return None

    scores = compute_scores(features)

    predictions = predict(scores, features)

    return predictions