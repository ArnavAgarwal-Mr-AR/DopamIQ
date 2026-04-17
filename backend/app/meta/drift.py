import numpy as np

def _euclidean_distance(vec1, vec2):
    v1 = np.array(vec1)
    v2 = np.array(vec2)
    return np.linalg.norm(v1 - v2)


def compute_drift(recent_features: dict, baseline_features: dict) -> float:
    """
    Compute behavioral drift between recent and baseline feature vectors.
    Returns value in range [0, 100]
    """

    if not recent_features or not baseline_features:
        return 0.0

    keys = set(recent_features.keys()).intersection(set(baseline_features.keys()))

    if not keys:
        return 0.0

    recent_vec = [recent_features[k] for k in keys]
    baseline_vec = [baseline_features[k] for k in keys]

    distance = _euclidean_distance(recent_vec, baseline_vec)

    # Normalize (heuristic scaling)
    drift_score = min(distance * 100, 100)

    return drift_score