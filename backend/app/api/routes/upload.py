from fastapi import APIRouter, UploadFile, File, Depends
import os


import zipfile
import io

from app.pipelines.pipeline_runner import run_pipeline
from app.api.dependencies import get_current_user

router = APIRouter()

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    user=Depends(get_current_user)
):
    user_id = user["user_id"]

    # Read zip file bytes
    file_bytes = await file.read()
    
    csv_filename = None
    csv_bytes = None
    
    import hashlib
    file_hash = hashlib.sha256(file_bytes).hexdigest()
    file_size = len(file_bytes)

    try:
        with zipfile.ZipFile(io.BytesIO(file_bytes)) as z:
            # Find the ViewingActivity.csv
            for name in z.namelist():
                if name.endswith("ViewingActivity.csv") and "__MACOSX" not in name and not name.split('/')[-1].startswith('._'):
                    csv_filename = name
                    break
            
            if not csv_filename:
                return {"status": "error", "message": "ViewingActivity.csv not found in the uploaded zip file."}
            
            csv_bytes = z.read(csv_filename)
    except zipfile.BadZipFile:
        return {"status": "error", "message": "Invalid zip file uploaded."}

    from app.db.session import SessionLocal
    from app.db.models import Job
    from datetime import datetime
    
    db = SessionLocal()
    try:
        # Check cache explicitly
        cached_job = db.query(Job).filter(Job.user_id == user_id, Job.file_hash == file_hash, Job.status == "completed").first()
        
        if cached_job:
            # Drop a new audit log mapping as 'cached' to track overall webapp utilization rate seamlessly
            cache_audit = Job(
                user_id=user_id, file_hash=file_hash, file_size_bytes=file_size, status="cached",
                total_events=cached_job.total_events, total_sessions=cached_job.total_sessions,
                score_computed_at=cached_job.score_computed_at, created_at=datetime.utcnow()
            )
            db.add(cache_audit)
            db.commit()
            return {"status": "success", "cached": True}
    finally:
        db.close()

    # Run pipeline entirely in-memory if cache missed
    csv_io = io.BytesIO(csv_bytes)
    result = run_pipeline(csv_io, user_id, file_hash, file_size)

    return {
        "status": "success",
        "user_id": user_id,
        "data": result
    }