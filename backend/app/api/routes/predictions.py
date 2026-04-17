from fastapi import APIRouter, Depends
from app.services.prediction_service import get_predictions
from app.api.dependencies import get_current_user

router = APIRouter()


@router.get("/predictions")
def fetch_predictions(user=Depends(get_current_user)):
    user_id = user["user_id"]

    predictions = get_predictions(user_id)

    if not predictions:
        return {"error": "No predictions found"}

    return predictions