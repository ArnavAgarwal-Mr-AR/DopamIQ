from datetime import timedelta, timezone
import uuid

SESSION_GAP = timedelta(minutes=30)
IST = timezone(timedelta(hours=5, minutes=30))

def _to_ist(ts):
    """Convert naive UTC timestamp to IST."""
    if ts is None:
        return ts
    if ts.tzinfo is None:
        ts = ts.replace(tzinfo=timezone.utc)
    return ts.astimezone(IST)


def create_sessions(events):
    if not events:
        return []

    events = sorted(events, key=lambda x: x["timestamp"])

    sessions = []
    current_session = []

    for event in events:
        if not current_session:
            current_session.append(event)
            continue

        gap = event["timestamp"] - current_session[-1]["timestamp"]

        if gap > SESSION_GAP:
            sessions.append(_finalize_session(current_session))
            current_session = [event]
        else:
            current_session.append(event)

    if current_session:
        sessions.append(_finalize_session(current_session))

    return sessions


def _finalize_session(events):
    start_time = events[0]["timestamp"]
    end_time = events[-1]["timestamp"]

    titles = set(e["title"] for e in events if e["event_type"] == "WATCH")
    duration_secs = (end_time - start_time).total_seconds()

    # Binge flag: >=2 unique titles OR session > 1.5 hours
    # The old threshold of >=3 was too strict (avg titles/session is 1.25)
    binge_flag = len(titles) >= 2 or duration_secs > 5400

    return {
        "session_id": str(uuid.uuid4()),
        "events": events,
        "start_time": start_time,   # stored as UTC naive, IST conversion in features
        "end_time": end_time,
        "duration": duration_secs,
        "num_titles": len(titles),
        "binge_flag": binge_flag,
    }