import pandas as pd
import io

def load_viewing_activity(file_obj: io.BytesIO) -> pd.DataFrame:
    df = pd.read_csv(file_obj)

    # Normalize column names
    df.columns = [c.strip() for c in df.columns]

    # Convert timestamps to UTC as per spec
    if "Start Time" in df.columns:
        df["timestamp"] = pd.to_datetime(df["Start Time"], errors="coerce", utc=True).dt.tz_localize(None)

    # Convert duration to seconds
    if "Duration" in df.columns:
        df["duration"] = pd.to_timedelta(df["Duration"], errors="coerce").dt.total_seconds()

    # Drop invalid rows
    df = df.dropna(subset=["timestamp"])

    return df