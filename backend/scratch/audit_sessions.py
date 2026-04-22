from app.db.session import SessionLocal
from app.db.models import Session, Job
from sqlalchemy import func

db = SessionLocal()

# 1. Check all users in Sessions
session_users = db.query(Session.user_id, func.count(Session.session_id)).group_by(Session.user_id).all()
print("--- Sessions Per User ---")
for user_id, count in session_users:
    print(f"User: {user_id} | Sessions: {count}")

# 2. Check Jobs (Upload history)
jobs = db.query(Job.user_id, Job.status, Job.total_sessions).all()
print("\n--- Upload Jobs ---")
for j in jobs:
    print(f"User: {j.user_id} | Status: {j.status} | Sessions: {j.total_sessions}")

db.close()
