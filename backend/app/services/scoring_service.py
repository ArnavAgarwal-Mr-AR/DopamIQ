from app.features.feature_store import FeatureStore
from app.scoring.scoring_engine import compute_scores

feature_store = FeatureStore()


def get_scores(user_id: str):
    features = feature_store.get_latest_features(user_id)

    if not features:
        return None

    scores = compute_scores(features)

    return scores