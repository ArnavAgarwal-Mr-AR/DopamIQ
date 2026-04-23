from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.services.llm_service import explain, simulate
from app.api.dependencies import get_current_user

router = APIRouter()


class ExplainRequest(BaseModel):
    scores: dict
    predictions: dict


class SimulateRequest(BaseModel):
    scenario: dict


@router.post("/llm/explain")
def explain_behavior(
    req: ExplainRequest,
    user=Depends(get_current_user)
):
    response = explain(req.scores, req.predictions, user["user_id"])

    return {
        "explanation": response
    }

from app.services.scoring_service import get_scores

import logging
logger = logging.getLogger(__name__)

@router.post("/llm/simulate")
def simulate_behavior(
    req: SimulateRequest,
    user=Depends(get_current_user)
):
    user_id = user["user_id"]
    scores = get_scores(user_id)
    
    mode = req.scenario.get("mode", "day")
    logger.info(f"SIMULATE_START: User={user_id} Mode={mode} Scenario={req.scenario}")
    
    result = simulate(req.scenario, scores=scores, user_id=user_id, mode=mode)

    return {
        "predicted_behavior": result
    }
