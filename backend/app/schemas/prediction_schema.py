from pydantic import BaseModel

class PredictionResponse(BaseModel):
    click_probability: float
    abandonment_probability: float
    binge_probability: float
    expected_duration: float


class PredictionError(BaseModel):
    error: str