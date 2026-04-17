class AbandonmentModel:
    """
    Simple rule-based / logistic-style model
    """

    def predict(self, features: dict, context: dict = None) -> float:
        completion = features.get("completion_rate", 0.5)
        focus = context.get("focus", 50) if context else 50
        session_length = context.get("session_length", 60) if context else 60

        prob = (
            0.5 * (1 - completion) +
            0.3 * (1 - focus / 100) +
            0.2 * min(session_length / 180, 1)
        )

        return max(0.0, min(1.0, prob))