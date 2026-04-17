def compute_susceptibility(features: dict) -> float:
    """
    Estimate how easily user behavior is influenced.
    Returns value in range [0, 100]
    """

    recommendation_ctr = features.get("recommendation_ctr", 0.5)
    autoplay_ratio = features.get("autoplay_ratio", 0.0)
    popularity_bias = features.get("popularity_bias", 0.5)
    inverse_decision_time = features.get("inverse_decision_time", 0.5)

    susceptibility = (
        0.3 * recommendation_ctr +
        0.3 * autoplay_ratio +
        0.2 * popularity_bias +
        0.2 * inverse_decision_time
    ) * 100

    return max(0.0, min(100.0, susceptibility))