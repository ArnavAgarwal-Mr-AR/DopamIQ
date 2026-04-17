from fastapi import APIRouter, Depends
from app.services.meta_service import get_meta_metrics
from app.api.dependencies import get_current_user

router = APIRouter()


@router.get("/meta")
def fetch_meta(user=Depends(get_current_user)):
    user_id = user["user_id"]

    meta = get_meta_metrics(user_id)

    if not meta:
        return {"error": "No meta metrics found"}

    return meta