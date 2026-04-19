from fastapi import Depends, Header
from app.db.session import SessionLocal

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(x_user_id: str = Header(None)):
    return {"user_id": x_user_id or "guest"}