import numpy as np
from collections import Counter

def _entropy(values):
    if not values:
        return 0.0

    counts = Counter(values)
    probs = np.array(list(counts.values())) / len(values)

    return -np.sum(probs * np.log(probs + 1e-9))


def compute_predictability(events: list, sessions: list) -> float:
    """
    Compute predictability score based on entropy + variance.
    Returns value in range [0, 100]
    """

    if not events or not sessions:
        return 50.0

    # Action entropy
    actions = [e["event_type"] for e in events]
    action_entropy = _entropy(actions)

    # Title entropy (proxy for genre entropy if missing)
    titles = [e["title"] for e in events]
    title_entropy = _entropy(titles)

    # Session time variance
    session_times = [s["start_time"].hour for s in sessions]
    time_variance = np.var(session_times) if len(session_times) > 1 else 0

    # Session duration variance
    durations = [s["duration"] for s in sessions]
    duration_variance = np.var(durations) if len(durations) > 1 else 0

    # Normalize components
    action_entropy = min(action_entropy / 3, 1)
    title_entropy = min(title_entropy / 5, 1)
    time_variance = min(time_variance / 100, 1)
    duration_variance = min(duration_variance / (3600 ** 2), 1)

    unpredictability = (
        0.3 * action_entropy +
        0.3 * title_entropy +
        0.2 * time_variance +
        0.2 * duration_variance
    )

    predictability = (1 - unpredictability) * 100

    return max(0.0, min(100.0, predictability))