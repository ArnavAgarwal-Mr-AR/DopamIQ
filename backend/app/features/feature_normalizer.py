import numpy as np

def min_max_scale(value, min_val, max_val):
    if max_val - min_val == 0:
        return 0.5  # neutral value

    return (value - min_val) / (max_val - min_val)


def clip(value, min_val=0.0, max_val=1.0):
    return max(min(value, max_val), min_val)


def normalize_features(features: dict) -> dict:
    """
    Normalize all features to [0,1]
    """

    normalized = {}

    # Example scaling assumptions (can evolve later)
    scaling_rules = {
        "avg_session_duration": (0, 4 * 3600),  # up to 4 hours
        "late_night_ratio": (0, 1),
        "completion_rate": (0, 1),
        "pause_frequency": (0, 20),
        "rewind_ratio": (0, 1),
        "genre_entropy": (0, 3),
        "novelty_score": (0, 1),
        "variance_usage": (0, 1),
    }

    for key, value in features.items():
        if key in scaling_rules:
            min_val, max_val = scaling_rules[key]
            scaled = min_max_scale(value, min_val, max_val)
            normalized[key] = clip(scaled)
        else:
            # fallback: assume already normalized
            normalized[key] = clip(value)

    return normalized