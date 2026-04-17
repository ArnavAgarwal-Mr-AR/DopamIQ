import tempfile
import pandas as pd
from app.pipelines.pipeline_runner import run_pipeline


def create_dummy_csv():
    data = {
        "Start Time": pd.date_range(start="2024-01-01", periods=10, freq="10T"),
        "Duration": ["00:30:00"] * 10,
        "Title": [f"Title_{i%3}" for i in range(10)],
        "Device Type": ["mobile"] * 10,
    }
    df = pd.DataFrame(data)

    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".csv")
    df.to_csv(tmp.name, index=False)
    return tmp.name


def test_pipeline_runs():
    file_path = create_dummy_csv()
    result = run_pipeline(file_path, user_id="test_user")

    assert "features" in result
    assert "scores" in result
    assert "predictions" in result

    assert isinstance(result["features"], dict)
    assert isinstance(result["scores"], dict)
    assert isinstance(result["predictions"], dict)