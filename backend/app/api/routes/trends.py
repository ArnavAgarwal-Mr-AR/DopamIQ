from fastapi import APIRouter, Depends
from app.services.trend_service import get_trends, get_behavioral_signals
from app.api.dependencies import get_current_user

router = APIRouter()

@router.get("/trends")
def trends(user=Depends(get_current_user)):
    return get_trends(user["user_id"])

@router.get("/trends/signals")
def signals(view: str = "day", user=Depends(get_current_user)):
    print(f"DEBUG: Signals Request - User: {user['user_id']} | View: {view}")
    return get_behavioral_signals(user["user_id"], view=view)