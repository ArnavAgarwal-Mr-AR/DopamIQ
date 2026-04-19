from fastapi import APIRouter, Depends
from app.services.trend_service import get_trends
from app.api.dependencies import get_current_user

router = APIRouter()

@router.get("/trends")
def trends(user=Depends(get_current_user)):
    return get_trends(user["user_id"])