from app.scoring.weights import WEIGHTS

def safe_get(features, key, default=0.0):
    return float(features.get(key, default))


def compute_discipline(features):
    """
    Lower discipline = more late-night + binge + autoplay.
    IST-corrected late_night_ratio now flows through correctly.
    """
    w = WEIGHTS["discipline"]
    score = 100 - (
        w["late_night_ratio"] * safe_get(features, "late_night_ratio") * 100 +
        w["binge_factor"]     * safe_get(features, "binge_factor") * 100 +
        w["autoplay_ratio"]   * safe_get(features, "autoplay_ratio") * 100
    )
    return max(0.0, min(100.0, score))

def compute_focus(features):
    """
    High focus = consistently completes sessions relative to personal average.
    
    completion_rate here is personalized (session > 60% of user's avg duration).
    A 30% completion rate is NOT low — it means 30% of sessions go significantly
    beyond the user's typical length, which IS focused behaviour.
    
    Formula: completion_rate drives the score. Dampened abandonment penalty
    to avoid double-counting (abandonment = 1 - completion).
    """
    completion = safe_get(features, "completion_rate")  # 0-1 normalized
    # Scale: 50% completion → score ~50, 100% → ~85, 0% → ~15
    # Using a softer curve: base 15 + completion contribution
    score = 15 + (completion * 85)
    return max(0.0, min(100.0, round(score, 1)))


def compute_curiosity(features):
    """
    Curiosity = genre/title diversity + novelty seeking.
    genre_entropy now uses title diversity as fallback when genre data absent.
    """
    w = WEIGHTS["curiosity"]
    score = (
        w["genre_entropy"]   * safe_get(features, "genre_entropy") * 100 +
        w["novelty_score"]   * safe_get(features, "novelty_score") * 100 +
        w["search_activity"] * safe_get(features, "search_activity") * 100
    )
    return max(0.0, min(100.0, score))


def compute_consistency(features):
    """
    Consistency = how evenly spread viewing is across days of the week.
    Uses entropy-based consistency_score (0=erratic, 1=perfectly uniform).
    Replaces the broken variance_usage approach.
    """
    # Use consistency_score if available (new pipeline), fallback to variance_usage
    if "consistency_score" in features:
        score = safe_get(features, "consistency_score") * 100
    else:
        score = 100 - safe_get(features, "variance_usage") * 100
    return max(0.0, min(100.0, score))


def compute_impulsivity(features):
    """
    High impulsivity = high autoplay + high binge + low decision time.
    """
    w = WEIGHTS["impulsivity"]
    score = (
        w["autoplay_ratio"]        * safe_get(features, "autoplay_ratio") * 100 +
        w["inverse_decision_time"] * safe_get(features, "inverse_decision_time") * 100 +
        w["binge_factor"]          * safe_get(features, "binge_factor") * 100
    )
    return max(0.0, min(100.0, score))


def compute_scores(features: dict) -> dict:
    return {
        "discipline":   round(compute_discipline(features), 1),
        "focus":        round(compute_focus(features), 1),
        "curiosity":    round(compute_curiosity(features), 1),
        "consistency":  round(compute_consistency(features), 1),
        "impulsivity":  round(compute_impulsivity(features), 1),
    }