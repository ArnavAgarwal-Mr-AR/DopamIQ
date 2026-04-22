import numpy as np

def min_max_scale(value, min_val, max_val):
    if max_val - min_val == 0:
        return 0.5
    return (value - min_val) / (max_val - min_val)

def clip(value, min_val=0.0, max_val=1.0):
    return max(min(float(value), max_val), min_val)

def normalize_features(features: dict) -> dict:
    """
    Normalize all features to [0,1].
    Scaling rules calibrated against real Netflix viewing data.
    """
    normalized = {}

    scaling_rules = {
        # avg session duration in seconds. Range: 0 to 3 hrs (10800s)
        # Typical Netflix session: 5 min (300s) to 2h (7200s)
        "avg_session_duration": (0, 10800),

        "late_night_ratio":       (0, 1),
        "completion_rate":        (0, 1),

        # pause_frequency: pauses per session. Range 0-5 (Netflix data rarely has explicit pauses)
        "pause_frequency":        (0, 5),

        "rewind_ratio":           (0, 1),

        # genre_entropy: using title diversity proxy. Range 0 to ln(N_titles)
        # For 5000 sessions with ~1.25 titles avg = ~6250 unique views, ln(6250)~8.7
        # We cap at 5 to give reasonable spread
        "genre_entropy":          (0, 5),

        "novelty_score":          (0, 1),
        "rewatch_ratio":          (0, 1),

        # coefficient of variation. Range 0-3 (higher = more erratic)
        "variance_usage":         (0, 3),

        # consistency_score is already 0-1
        "consistency_score":      (0, 1),

        "binge_factor":           (0, 1),
        "autoplay_ratio":         (0, 1),
        "abandonment_rate":       (0, 1),
        "search_activity":        (0, 1),
        "inverse_decision_time":  (0, 1),

        # avg_titles_per_session: range 0-5
        "avg_titles_per_session": (0, 5),
        "max_binge_length":       (0, 10),
    }

    for key, value in features.items():
        if key in scaling_rules:
            min_val, max_val = scaling_rules[key]
            scaled = min_max_scale(value, min_val, max_val)
            normalized[key] = clip(scaled)
        else:
            normalized[key] = clip(value)

    return normalized