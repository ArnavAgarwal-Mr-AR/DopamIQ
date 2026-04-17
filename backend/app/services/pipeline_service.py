from app.pipelines.pipeline_runner import run_pipeline
from app.features.feature_store import FeatureStore

feature_store = FeatureStore()


def run_and_store_pipeline(file_path: str, user_id: str):
    """
    Runs full pipeline and persists features.
    """
    result = run_pipeline(file_path, user_id)

    if "error" in result:
        return result

    # Store features
    feature_store.store_features(user_id, result["features"])

    return result