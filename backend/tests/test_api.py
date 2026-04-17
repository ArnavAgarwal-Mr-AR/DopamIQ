from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "status" in response.json()


def test_scores_endpoint():
    response = client.get("/api/scores")
    assert response.status_code == 200


def test_predictions_endpoint():
    response = client.get("/api/predictions")
    assert response.status_code == 200


def test_meta_endpoint():
    response = client.get("/api/meta")
    assert response.status_code == 200


def test_llm_explain():
    payload = {
        "scores": {"discipline": 50},
        "predictions": {"binge_probability": 0.7}
    }

    response = client.post("/api/llm/explain", json=payload)
    assert response.status_code == 200
    assert "explanation" in response.json()


def test_llm_simulate():
    payload = {"scenario": {"time": "23:00"}}

    response = client.post("/api/llm/simulate", json=payload)
    assert response.status_code == 200
    assert "predicted_behavior" in response.json()