from app.scoring.scoring_engine import compute_scores


def test_scoring_output_range():
    features = {
        "late_night_ratio": 0.5,
        "binge_factor": 0.5,
        "autoplay_ratio": 0.5,
        "completion_rate": 0.7,
        "pause_frequency": 0.2,
        "abandonment_rate": 0.3,
        "genre_entropy": 0.6,
        "novelty_score": 0.5,
        "search_activity": 0.5,
        "variance_usage": 0.4,
        "inverse_decision_time": 0.5,
    }

    scores = compute_scores(features)

    for key, value in scores.items():
        assert 0 <= value <= 100, f"{key} out of bounds"