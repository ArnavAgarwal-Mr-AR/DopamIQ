class DurationModel:
    """
    Predicts expected session duration (minutes)
    """

    def predict(self, features: dict, context: dict = None) -> float:
        avg_duration = features.get("avg_session_duration", 1800)  # seconds
        binge_factor = features.get("binge_factor", 0)
        focus = context.get("focus", 50) if context else 50

        duration = (
            avg_duration / 60 +
            30 * binge_factor +
            20 * (focus / 100)
        )

        return max(5, duration)