import uuid

def normalize_events(df, user_id: str):
    events = []

    for _, row in df.iterrows():
        duration = row.get("duration", 0)

        # Ignore very short events
        if duration is not None and duration < 10:
            continue

        event = {
            "event_id": str(uuid.uuid4()),
            "user_id": user_id,
            "timestamp": row["timestamp"],
            "event_type": "WATCH",
            "title": row.get("Title", "unknown"),
            "duration": duration if duration else 0,
            "device": row.get("Device Type", "unknown"),
            "metadata": {
                "autoplay": False,
                "completed": duration and duration > 0,
                "genre": None,
            }
        }

        events.append(event)

    return events