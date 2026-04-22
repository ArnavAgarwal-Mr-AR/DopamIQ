"""
Compare what the browser gets vs actual DB distribution.
The day graph shows prob:100 at 01:00 but real peak should be 07:00 IST.
Check if the signals are serving the right user's data.
"""
from app.db.session import SessionLocal
from sqlalchemy import text

db = SessionLocal()

# Check each user's hourly distribution
users = db.execute(text("SELECT DISTINCT user_id FROM sessions")).fetchall()

for (uid,) in users:
    r = db.execute(text("""
        SELECT
            extract(hour FROM start_time AT TIME ZONE 'Asia/Kolkata')::int AS hr,
            count(*) AS cnt
        FROM sessions WHERE user_id = :uid
        GROUP BY hr ORDER BY cnt DESC LIMIT 3
    """), {"uid": uid}).fetchall()
    print(f"{uid[:12]}: peak hours = {[(row.hr, row.cnt) for row in r]}")

print()

# Check what the trend_service actually returns for demo_user
print("=== trend_service day signals for demo_user ===")
from app.services.trend_service import get_behavioral_signals
sigs = get_behavioral_signals("demo_user", view="day")
peak = max(sigs, key=lambda s: s["prob"])
print(f"Peak hour: {peak['label']}:00 with prob={peak['prob']}")
print(f"All: {[(s['label'], s['prob']) for s in sigs if s['prob'] > 40]}")

print()
# Check total sessions per user to confirm they're separate datasets
print("=== Session counts per user ===")
counts = db.execute(text("""
    SELECT user_id, count(*) as cnt, min(start_time)::date as earliest, max(start_time)::date as latest
    FROM sessions GROUP BY user_id ORDER BY cnt DESC
""")).fetchall()
for r in counts:
    print(f"  {r.user_id[:12]}: {r.cnt} sessions  {r.earliest} → {r.latest}")

db.close()
