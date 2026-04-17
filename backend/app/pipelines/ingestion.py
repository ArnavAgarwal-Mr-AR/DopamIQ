import pandas as pd

def load_viewing_activity(file_path: str) -> pd.DataFrame:
    df = pd.read_csv(file_path)

    # Normalize column names
    df.columns = [c.strip() for c in df.columns]

    # Convert timestamps
    if "Start Time" in df.columns:
        df["timestamp"] = pd.to_datetime(df["Start Time"], errors="coerce")

    # Convert duration to seconds
    if "Duration" in df.columns:
        df["duration"] = pd.to_timedelta(df["Duration"], errors="coerce").dt.total_seconds()

    # Drop invalid rows
    df = df.dropna(subset=["timestamp"])

    return df