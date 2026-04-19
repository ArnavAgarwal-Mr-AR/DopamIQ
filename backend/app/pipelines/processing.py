import uuid

def normalize_events(df, user_id: str):
    events = []

    for _, row in df.iterrows():
        duration = row.get("duration", 0)

        # Ignore very short events
        if duration is not None and duration < 10:
            continue

        attrs = str(row.get("Attributes", ""))
        supp_type = str(row.get("Supplemental Video Type", ""))
        
        is_autoplay = "Autoplay" in attrs or (supp_type and supp_type.lower() not in ["none", "nan", ""])

        event = {
            "event_id": str(uuid.uuid4()),
            "user_id": user_id,
            "timestamp": row["timestamp"],
            "event_type": "WATCH",
            "title": row.get("Title", "unknown"),
            "duration": duration if duration else 0,
            "device": row.get("Device Type", "unknown"),
            "event_metadata": {
                "autoplay": is_autoplay,
                "completed": duration > 1200,  # Proxy for > 20 mins watched
                "genre": None,
                "supplemental_type": supp_type if supp_type != "nan" else None
            }
        }

        events.append(event)

    return events