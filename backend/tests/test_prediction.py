from app.prediction.predictor import predict


def test_prediction_output():
    features = {
        "late_night_ratio": 0.6,
        "binge_factor": 0.5,
        "novelty_score": 0.5,
        "completion_rate": 0.7,
        "avg_session_duration": 1800,
    }

    scores = {
        "discipline": 60,
        "focus": 70,
        "curiosity": 65,
        "consistency": 50,
        "impulsivity": 55,
    }

    result = predict(scores, features)

    assert "click_probability" in result
    assert "binge_probability" in result
    assert "abandonment_probability" in result
    assert "expected_duration" in result

    assert 0 <= result["click_probability"] <= 1
    assert 0 <= result["binge_probability"] <= 1
    assert 0 <= result["abandonment_probability"] <= 1
    assert result["expected_duration"] > 0