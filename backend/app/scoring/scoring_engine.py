from app.scoring.weights import WEIGHTS

def safe_get(features, key, default=0.0):
    return features.get(key, default)


def compute_discipline(features):
    w = WEIGHTS["discipline"]

    score = 100 - (
        w["late_night_ratio"] * safe_get(features, "late_night_ratio") * 100 +
        w["binge_factor"] * safe_get(features, "binge_factor") * 100 +
        w["autoplay_ratio"] * safe_get(features, "autoplay_ratio") * 100
    )

    return max(0, min(100, score))


def compute_focus(features):
    w = WEIGHTS["focus"]

    score = (
        w["completion_rate"] * safe_get(features, "completion_rate") * 100 -
        w["pause_frequency"] * safe_get(features, "pause_frequency") * 100 -
        w["abandonment_rate"] * safe_get(features, "abandonment_rate") * 100
    )

    return max(0, min(100, score))


def compute_curiosity(features):
    w = WEIGHTS["curiosity"]

    score = (
        w["genre_entropy"] * safe_get(features, "genre_entropy") * 100 +
        w["novelty_score"] * safe_get(features, "novelty_score") * 100 +
        w["search_activity"] * safe_get(features, "search_activity") * 100
    )

    return max(0, min(100, score))


def compute_consistency(features):
    w = WEIGHTS["consistency"]

    score = 100 - (
        w["variance_usage"] * safe_get(features, "variance_usage") * 100
    )

    return max(0, min(100, score))


def compute_impulsivity(features):
    w = WEIGHTS["impulsivity"]

    score = (
        w["autoplay_ratio"] * safe_get(features, "autoplay_ratio") * 100 +
        w["inverse_decision_time"] * safe_get(features, "inverse_decision_time") * 100 +
        w["binge_factor"] * safe_get(features, "binge_factor") * 100
    )

    return max(0, min(100, score))


def compute_scores(features: dict) -> dict:
    """
    Main scoring function
    """

    return {
        "discipline": int(round(compute_discipline(features))),
        "focus": int(round(compute_focus(features))),
        "curiosity": int(round(compute_curiosity(features))),
        "consistency": int(round(compute_consistency(features))),
        "impulsivity": int(round(compute_impulsivity(features))),
    }