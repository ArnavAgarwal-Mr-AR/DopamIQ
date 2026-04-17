from pydantic import BaseModel

class ScoreResponse(BaseModel):
    discipline: float
    focus: float
    curiosity: float
    consistency: float
    impulsivity: float


class ScoreError(BaseModel):
    error: str