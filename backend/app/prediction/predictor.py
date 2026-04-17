from app.prediction.models.click_model import ClickModel
from app.prediction.models.binge_model import BingeModel
from app.prediction.models.abandonment_model import AbandonmentModel
from app.prediction.models.duration_model import DurationModel


class Predictor:
    def __init__(self):
        self.click_model = ClickModel()
        self.binge_model = BingeModel()
        self.abandonment_model = AbandonmentModel()
        self.duration_model = DurationModel()

    def predict(self, features: dict, scores: dict, context: dict = None):
        context = context or {}

        # Merge scores into context
        full_context = {**context, **scores}

        click_prob = self.click_model.predict(features, full_context)
        binge_prob = self.binge_model.predict(features, full_context)
        abandonment_prob = self.abandonment_model.predict(features, full_context)
        duration = self.duration_model.predict(features, full_context)

        return {
            "click_probability": click_prob,
            "binge_probability": binge_prob,
            "abandonment_probability": abandonment_prob,
            "expected_duration": duration
        }


# convenience function
def predict(scores: dict, features: dict, context: dict = None):
    predictor = Predictor()
    return predictor.predict(features, scores, context)