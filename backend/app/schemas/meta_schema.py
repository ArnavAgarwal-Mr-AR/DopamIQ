from pydantic import BaseModel

class MetaResponse(BaseModel):
    predictability: float
    drift: float
    susceptibility: float


class MetaError(BaseModel):
    error: str