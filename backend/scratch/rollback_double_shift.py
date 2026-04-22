"""
Undo the accidental double-shift on user 24d8b105 (already had IST timestamps).
Shift their sessions back by -5:30.
"""
from app.db.session import SessionLocal
from sqlalchemy import text

db = SessionLocal()
uid = "24d8b105-6262-4d01-afea-2864bc339d5f"

print(f"Rolling back double-shift for {uid[:12]}...")

db.execute(text("""
    UPDATE sessions
    SET start_time = start_time - INTERVAL '5 hours 30 minutes',
        end_time   = end_time   - INTERVAL '5 hours 30 minutes'
    WHERE user_id = :uid
"""), {"uid": uid})

db.execute(text("""
    UPDATE events
    SET timestamp = timestamp - INTERVAL '5 hours 30 minutes'
    WHERE user_id = :uid
"""), {"uid": uid})

db.commit()

peak = db.execute(text("""
    SELECT extract(hour FROM start_time)::int AS hr, count(*) AS cnt
    FROM sessions WHERE user_id = :uid
    GROUP BY hr ORDER BY cnt DESC LIMIT 1
"""), {"uid": uid}).fetchone()
print(f"  Peak hour after rollback: {peak.hr}:00  (should be 7)")

# Now verify all users
print("\n=== All users peak hours (no AT TIME ZONE - raw stored values) ===")
rows = db.execute(text("""
    SELECT user_id,
           extract(hour FROM start_time)::int AS hr,
           count(*) AS cnt
    FROM sessions
    GROUP BY user_id, extract(hour FROM start_time)::int
    ORDER BY user_id, cnt DESC
""")).fetchall()

from collections import defaultdict
by_user = defaultdict(list)
for r in rows:
    by_user[r.user_id].append((r.hr, r.cnt))

for uid, hrs in by_user.items():
    top = sorted(hrs, key=lambda x: -x[1])[:1]
    print(f"  {uid[:12]}  peak={top[0][0]}:00  cnt={top[0][1]}")

db.close()
print("\nDone.")
