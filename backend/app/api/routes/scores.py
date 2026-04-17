from fastapi import APIRouter, Depends
from app.services.scoring_service import get_scores
from app.api.dependencies import get_current_user

router = APIRouter()


@router.get("/scores")
def fetch_scores(user=Depends(get_current_user)):
    user_id = user["user_id"]

    scores = get_scores(user_id)

    if not scores:
        return {"error": "No scores found"}

    return scores