from app.db.session import SessionLocal
from app.db.models import Session
from sqlalchemy import func

db = SessionLocal()
user_id = "demo_user"

stats = db.query(
    func.min(Session.start_time),
    func.max(Session.start_time),
    func.count(Session.session_id)
).filter(Session.user_id == user_id).first()

print(f"User: {user_id}")
print(f"Min Start Time: {stats[0]}")
print(f"Max Start Time: {stats[1]}")
print(f"Total Sessions: {stats[2]}")

# Check a sample of raw start_times
samples = db.query(Session.start_time).filter(Session.user_id == user_id).limit(5).all()
print("\nSample Start Times:")
for s in samples:
    print(s[0])

db.close()
