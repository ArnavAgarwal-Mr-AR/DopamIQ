import requests
import json

# We'll simulate a request to the signals endpoint
# Note: In a real environment, we'd need the auth token, but I'll check the service logic directly with a mock
from app.services.trend_service import get_behavioral_signals
from app.db.session import SessionLocal
from app.db.models import Session

db = SessionLocal()
# Check what users actually exist in the sessions table
users = db.query(Session.user_id).distinct().all()
print(f"Users in DB: {[u[0] for u in users]}")

for user_id in [u[0] for u in users]:
    signals = get_behavioral_signals(user_id, view="day")
    active_points = [s for s in signals if s['prob'] > 0]
    print(f"User: {user_id} | Day Signals Points with data: {len(active_points)}/24")
    if active_points:
        print(f"Sample data: {active_points[0]}")

db.close()
