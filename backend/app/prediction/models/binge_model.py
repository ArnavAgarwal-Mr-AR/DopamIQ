class BingeModel:
    """
    Predicts probability of binge session
    """

    def predict(self, features: dict, context: dict = None) -> float:
        late_night = features.get("late_night_ratio", 0)
        impulsivity = context.get("impulsivity", 50) if context else 50
        binge_factor = features.get("binge_factor", 0)

        prob = (
            0.4 * late_night +
            0.3 * (impulsivity / 100) +
            0.3 * binge_factor
        )

        return max(0.0, min(1.0, prob))