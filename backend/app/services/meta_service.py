from app.features.feature_store import FeatureStore
from app.meta.predictability import compute_predictability
from app.meta.susceptibility import compute_susceptibility
from app.meta.drift import compute_drift

feature_store = FeatureStore()


def get_meta_metrics(user_id: str):
    features = feature_store.get_latest_features(user_id)

    if not features:
        return None

    # Placeholder: need events + sessions for full predictability
    predictability = compute_predictability([], [])

    susceptibility = compute_susceptibility(features)

    # Drift needs two windows — placeholder using same features
    drift = compute_drift(features, features)

    return {
        "predictability": predictability,
        "drift": drift,
        "susceptibility": susceptibility
    }