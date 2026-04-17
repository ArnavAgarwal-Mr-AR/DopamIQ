class ClickModel:
    """
    Predicts click probability
    """

    def predict(self, features: dict, context: dict = None) -> float:
        curiosity = context.get("curiosity", 50) if context else 50
        novelty = features.get("novelty_score", 0.5)
        impulsivity = context.get("impulsivity", 50) if context else 50

        prob = (
            0.4 * (curiosity / 100) +
            0.3 * novelty +
            0.3 * (impulsivity / 100)
        )

        return max(0.0, min(1.0, prob))