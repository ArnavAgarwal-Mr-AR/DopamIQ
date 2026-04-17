from app.db.postgres import SessionLocal
from fastapi import Depends
from contextlib import contextmanager


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Optional (for later use)
def get_current_user():
    # Placeholder for auth
    return {"user_id": "demo_user"}