from fastapi import APIRouter, UploadFile, File, Depends
import os
import shutil
import uuid

from app.services.pipeline_service import run_pipeline
from app.api.dependencies import get_current_user

router = APIRouter()


UPLOAD_DIR = "data/raw"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    user=Depends(get_current_user)
):
    user_id = user["user_id"]

    # Save file
    file_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}.csv")

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Run pipeline
    result = run_pipeline(file_path, user_id)

    return {
        "status": "success",
        "user_id": user_id,
        "data": result
    }