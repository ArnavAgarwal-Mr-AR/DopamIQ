class DurationModel:
    """
    Predicts expected session duration (minutes).
    
    IMPORTANT: receives NORMALIZED features (0-1 range).
    avg_session_duration normalized against 0-10800s range.
    Must reverse-scale before converting to minutes.
    """

    AVG_SESSION_MAX_SECONDS = 10800  # normalization ceiling from feature_normalizer.py

    def predict(self, features: dict, context: dict = None) -> float:
        # features["avg_session_duration"] is normalized 0-1
        # Reverse: multiply by ceiling to get approximate raw seconds
        norm_duration = features.get("avg_session_duration", 0.033)  # ~355s default
        raw_seconds = norm_duration * self.AVG_SESSION_MAX_SECONDS
        avg_duration_mins = raw_seconds / 60  # convert to minutes

        binge_factor = features.get("binge_factor", 0)       # already 0-1
        focus = context.get("focus", 50) if context else 50  # 0-100 score

        duration = (
            avg_duration_mins +
            15 * binge_factor +        # binge adds up to 15 min
            10 * (focus / 100)         # focus adds up to 10 min
        )

        # Minimum realistic floor: 5 min (not 15 — 15 was masking real short sessions)
        return max(5.0, round(duration, 1))