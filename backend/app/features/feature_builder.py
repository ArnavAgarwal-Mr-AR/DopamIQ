import numpy as np
from datetime import datetime, timezone, timedelta

IST = timezone(timedelta(hours=5, minutes=30))

def _to_ist(ts):
    """Convert a naive UTC timestamp to IST-aware datetime."""
    if ts is None:
        return None
    if ts.tzinfo is None:
        ts = ts.replace(tzinfo=timezone.utc)
    return ts.astimezone(IST)

def _is_late_night(ts):
    """Late night = 22:00 - 05:00 IST. Previously used raw UTC which was wrong."""
    ts_ist = _to_ist(ts)
    if ts_ist is None:
        return False
    hour = ts_ist.hour
    return hour >= 22 or hour < 5


def build_features(sessions):
    if not sessions:
        return {}

    session_durations = []        # raw seconds
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
    all_titles = []

    # Day-of-week spread for consistency
    dow_counts = [0] * 7  # Mon=0 ... Sun=6

    for session in sessions:
        duration = session["duration"]  # seconds
        session_durations.append(duration)

        ts_ist = _to_ist(session["start_time"])
        if ts_ist:
            if _is_late_night(session["start_time"]):
                late_night_count += 1
            dow_counts[ts_ist.weekday()] += 1

        titles_in_session = set()
        for event in session["events"]:
            total_events += 1

            if event["event_type"] == "WATCH":
                started += 1
                title = event["title"]
                titles_in_session.add(title)
                all_titles.append(title)

                # Completion proxy: watched more than 15 mins
                if event.get("duration", 0) > 900:
                    completed += 1

                if title in watched_titles:
                    rewatch_count += 1
                else:
                    watched_titles.add(title)

            if event["event_type"] == "PAUSE":
                pauses += 1
            if event["event_type"] == "REWIND":
                rewinds += 1

            genre = event.get("event_metadata", {}).get("genre")
            if genre:
                genres.append(genre)

        total_titles += len(titles_in_session)

        # Binge: >= 2 titles OR session > 1.5 hours (more realistic threshold)
        if len(titles_in_session) >= 2 or duration > 5400:
            binge_sessions += 1

    n = len(sessions)

    # ── Feature Calculations ──────────────────────────────────────

    avg_session_duration = float(np.mean(session_durations))  # seconds
    late_night_ratio = late_night_count / n

    avg_titles_per_session = total_titles / n

    max_binge_length = max(
        len(set(e["title"] for e in s["events"] if e["event_type"] == "WATCH"))
        for s in sessions
    )

    autoplay_sessions = sum(
        1 for s in sessions
        if any(e.get("event_metadata", {}).get("autoplay") for e in s["events"])
    )
    autoplay_ratio = autoplay_sessions / n

    completion_rate = completed / started if started > 0 else 0

    pause_frequency = pauses / n

    rewind_ratio = rewinds / total_events if total_events > 0 else 0

    # Genre entropy (only if genre data exists)
    from collections import Counter
    if genres:
        counts = Counter(genres)
        probs = np.array(list(counts.values())) / len(genres)
        genre_entropy = float(-np.sum(probs * np.log(probs + 1e-9)))
    else:
        # Fallback: use title diversity as a proxy for curiosity entropy
        title_counts = Counter(all_titles)
        probs = np.array(list(title_counts.values())) / len(all_titles) if all_titles else np.array([1.0])
        genre_entropy = float(-np.sum(probs * np.log(probs + 1e-9)))

    rewatch_ratio = rewatch_count / started if started > 0 else 0
    novelty_score = 1.0 - rewatch_ratio

    # Consistency: measure how spread the viewing is across days of the week
    # High variance in dow_counts = inconsistent. Low variance = consistent.
    dow_array = np.array(dow_counts, dtype=float)
    if dow_array.sum() > 0:
        dow_probs = dow_array / dow_array.sum()
        # Entropy-based: max entropy (uniform across 7 days) = consistent
        max_entropy = np.log(7)
        actual_entropy = float(-np.sum(dow_probs[dow_probs > 0] * np.log(dow_probs[dow_probs > 0])))
        consistency_score = actual_entropy / max_entropy  # 0-1, higher = more consistent
    else:
        consistency_score = 0.5

    # Session duration variance (normalized by mean to avoid unit issues)
    if len(session_durations) > 1 and avg_session_duration > 0:
        variance_usage = float(np.std(session_durations) / avg_session_duration)  # coefficient of variation
    else:
        variance_usage = 0.5

    binge_factor = binge_sessions / n
    abandonment_rate = 1.0 - completion_rate

    # These remain as reasonable proxies
    search_activity = min(1.0, novelty_score * 0.8 + 0.2)  # Derived from novelty
    inverse_decision_time = min(1.0, autoplay_ratio * 0.5 + 0.5)  # Autoplay = low decision time

    return {
        "avg_session_duration": avg_session_duration,
        "late_night_ratio": late_night_ratio,
        "avg_titles_per_session": avg_titles_per_session,
        "max_binge_length": float(max_binge_length),
        "autoplay_ratio": autoplay_ratio,
        "completion_rate": completion_rate,
        "pause_frequency": pause_frequency,
        "rewind_ratio": rewind_ratio,
        "genre_entropy": genre_entropy,
        "rewatch_ratio": rewatch_ratio,
        "novelty_score": novelty_score,
        "variance_usage": variance_usage,
        "consistency_score": consistency_score,
        "binge_factor": binge_factor,
        "abandonment_rate": abandonment_rate,
        "search_activity": search_activity,
        "inverse_decision_time": inverse_decision_time,
    }