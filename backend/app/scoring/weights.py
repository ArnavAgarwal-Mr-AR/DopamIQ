# All weights must sum to 1 within each score

WEIGHTS = {
    "discipline": {
        "late_night_ratio": 0.4,
        "binge_factor": 0.3,
        "autoplay_ratio": 0.3,
    },

    "focus": {
        "completion_rate": 0.5,
        "pause_frequency": 0.25,
        "abandonment_rate": 0.25,
    },

    "curiosity": {
        "genre_entropy": 0.4,
        "novelty_score": 0.3,
        "search_activity": 0.3,
    },

    "consistency": {
        "variance_usage": 1.0,
    },

    "impulsivity": {
        "autoplay_ratio": 0.4,
        "inverse_decision_time": 0.3,
        "binge_factor": 0.3,
    }
}