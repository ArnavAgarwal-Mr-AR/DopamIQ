from collections import Counter
from datetime import datetime
import numpy as np




def _is_late_night(ts):
    return 23 <= ts.hour or ts.hour < 3


def build_features(sessions):
    if not sessions:
        return {}

    session_durations = []
    late_night_count = 0
    total_titles = 0
    binge_sessions = 0
    total_events = 0

    pauses = 0
    rewinds = 0
    completed = 0
    started = 0

    genres = []
    rewatch_count = 0
    watched_titles = set()

    for session in sessions:
        duration = session["duration"]
        session_durations.append(duration)

        if _is_late_night(session["start_time"]):
            late_night_count += 1

        titles_in_session = set()
        for event in session["events"]:
            total_events += 1

            if event["event_type"] == "WATCH":
                started += 1
                titles_in_session.add(event["title"])

                if event.get("event_metadata", {}).get("completed", False):
                    completed += 1

                if event["title"] in watched_titles:
                    rewatch_count += 1
                else:
                    watched_titles.add(event["title"])

            if event["event_type"] == "PAUSE":
                pauses += 1

            if event["event_type"] == "REWIND":
                rewinds += 1

            genre = event.get("event_metadata", {}).get("genre")
            if genre:
                genres.append(genre)

        total_titles += len(titles_in_session)

        if len(titles_in_session) >= 3:
            binge_sessions += 1

    # ===== Feature Calculations =====

    avg_session_duration = np.mean(session_durations)

    late_night_ratio = late_night_count / len(sessions)

    avg_titles_per_session = total_titles / len(sessions)

    max_binge_length = max([
        len(set(e["title"] for e in s["events"] if e["event_type"] == "WATCH"))
        for s in sessions
    ])

    autoplay_sessions = sum(
        1 for s in sessions if any(e.get("event_metadata", {}).get("autoplay") for e in s["events"])
    )
    autoplay_ratio = autoplay_sessions / len(sessions)

    completion_rate = completed / started if started > 0 else 0

    pause_frequency = pauses / len(sessions)

    rewind_ratio = rewinds / total_events if total_events > 0 else 0

    # Genre entropy
    if genres:
        counts = Counter(genres)
        probs = np.array(list(counts.values())) / len(genres)
        genre_entropy = -np.sum(probs * np.log(probs + 1e-9))
    else:
        genre_entropy = 0

    rewatch_ratio = rewatch_count / started if started > 0 else 0

    novelty_score = 1 - rewatch_ratio

    variance_usage = np.var(session_durations) if len(session_durations) > 1 else 0

    binge_factor = binge_sessions / len(sessions)

    abandonment_rate = 1 - completion_rate

    # Placeholder values (can improve later)
    search_activity = 0.5
    inverse_decision_time = 0.5

    return {
        "avg_session_duration": avg_session_duration,
        "late_night_ratio": late_night_ratio,
        "avg_titles_per_session": avg_titles_per_session,
        "max_binge_length": max_binge_length,
        "autoplay_ratio": autoplay_ratio,
        "completion_rate": completion_rate,
        "pause_frequency": pause_frequency,
        "rewind_ratio": rewind_ratio,
        "genre_entropy": genre_entropy,
        "rewatch_ratio": rewatch_ratio,
        "novelty_score": novelty_score,
        "variance_usage": variance_usage,
        "binge_factor": binge_factor,
        "abandonment_rate": abandonment_rate,
        "search_activity": search_activity,
        "inverse_decision_time": inverse_decision_time,
    }