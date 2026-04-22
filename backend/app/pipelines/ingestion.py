import pandas as pd
import io

def load_viewing_activity(file_obj: io.BytesIO) -> pd.DataFrame:
    df = pd.read_csv(file_obj)

    # Normalize column names (strip whitespace)
    df.columns = [c.strip() for c in df.columns]

    # Parse timestamps
    # Netflix exports "Start Time" in UTC. We convert to IST (+05:30) then strip
    # the timezone info so it stores as a naive IST timestamp in the DB.
    # This is critical: all downstream features must assume stored times are IST.
    if "Start Time" in df.columns:
        utc_times = pd.to_datetime(df["Start Time"], errors="coerce", utc=True)
        # Convert to IST and strip tzinfo → naive IST datetime
        ist_times = utc_times.dt.tz_convert("Asia/Kolkata").dt.tz_localize(None)
        df["timestamp"] = ist_times

    # Convert duration column from HH:MM:SS to seconds
    if "Duration" in df.columns:
        df["duration"] = pd.to_timedelta(df["Duration"], errors="coerce").dt.total_seconds()

    # Drop rows without a valid timestamp
    df = df.dropna(subset=["timestamp"])

    return df