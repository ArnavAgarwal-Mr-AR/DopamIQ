"""
Migrate all UTC-stored sessions to IST by shifting start_time and end_time
by +5:30. This fixes the day graph hour distribution for all legacy uploads.

Only migrates users whose peak IST hour is 1 (indicating raw UTC storage).
User 24d8b105 already has correct IST timestamps - skip them.
"""
from app.db.session import SessionLocal
from sqlalchemy import text

db = SessionLocal()

# Find users with UTC-stored data (peak IST hour = 1 = wrong)
users = db.execute(text("""
    SELECT user_id
    FROM (
        SELECT user_id,
               extract(hour FROM start_time AT TIME ZONE 'Asia/Kolkata')::int AS peak_hr,
               count(*) AS cnt
        FROM sessions
        GROUP BY user_id, extract(hour FROM start_time AT TIME ZONE 'Asia/Kolkata')::int
        ORDER BY cnt DESC
    ) ranked
    WHERE peak_hr = 1
    GROUP BY user_id
""")).fetchall()

print(f"Found {len(users)} users with UTC-stored sessions to migrate")

for (uid,) in users:
    print(f"\nMigrating {uid[:12]}...")

    # Shift all session times forward by +5:30 (19800 seconds)
    db.execute(text("""
        UPDATE sessions
        SET start_time = start_time + INTERVAL '5 hours 30 minutes',
            end_time   = end_time   + INTERVAL '5 hours 30 minutes'
        WHERE user_id = :uid
    """), {"uid": uid})

    # Also shift all events for this user
    db.execute(text("""
        UPDATE events
        SET timestamp = timestamp + INTERVAL '5 hours 30 minutes'
        WHERE user_id = :uid
    """), {"uid": uid})

    db.commit()

    # Verify
    peak = db.execute(text("""
        SELECT extract(hour FROM start_time)::int AS hr, count(*) AS cnt
        FROM sessions WHERE user_id = :uid
        GROUP BY hr ORDER BY cnt DESC LIMIT 1
    """), {"uid": uid}).fetchone()
    print(f"  New peak hour (now IST-stored): {peak.hr}:00")

print("\nMigration complete. All sessions now stored as IST.")
db.close()
