from fastapi import APIRouter, Depends
from app.services.manipulation_service import get_manipulation_report
from app.api.dependencies import get_current_user

router = APIRouter()

@router.get("/manipulation")
def manipulation(user=Depends(get_current_user)):
    user_id = user["user_id"]
    report = get_manipulation_report(user_id)
    
    if not report:
        return {"error": "No footprint data available to calculate manipulation metrics."}
        
    return report
