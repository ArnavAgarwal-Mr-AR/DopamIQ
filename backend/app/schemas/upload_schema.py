from pydantic import BaseModel
from typing import Dict, Any

class UploadResponse(BaseModel):
    status: str
    user_id: str
    data: Dict[str, Any]  # contains features, scores, predictions


class UploadError(BaseModel):
    status: str = "error"
    message: str