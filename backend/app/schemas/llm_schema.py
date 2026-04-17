from pydantic import BaseModel
from typing import Dict, Any

# =========================
# Explain
# =========================

class ExplainRequest(BaseModel):
    scores: Dict[str, float]
    predictions: Dict[str, float]


class ExplainResponse(BaseModel):
    explanation: str


# =========================
# Simulation
# =========================

class SimulationRequest(BaseModel):
    scenario: Dict[str, Any]


class SimulationResponse(BaseModel):
    predicted_behavior: Dict[str, Any]


# =========================
# Errors
# =========================

class LLMError(BaseModel):
    error: str