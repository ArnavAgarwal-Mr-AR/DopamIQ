from datetime import timedelta
import uuid

SESSION_GAP = timedelta(minutes=30)

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

    return {
        "session_id": str(uuid.uuid4()),
        "events": events,
        "start_time": start_time,
        "end_time": end_time,
        "duration": (end_time - start_time).total_seconds(),
        "num_titles": len(titles),
        "binge_flag": len(titles) >= 3
    }