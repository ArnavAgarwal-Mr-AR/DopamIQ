"""
Find the user_id with correctly IST-stored sessions (peak at realistic IST hours).
"""
from app.db.session import SessionLocal
from sqlalchemy import text

db = SessionLocal()
rows = db.execute(text("""
    SELECT user_id, count(*) as cnt
    FROM sessions
    GROUP BY user_id
    ORDER BY cnt DESC
""")).fetchall()

for row in rows:
    # Check peak hour with AT TIME ZONE
    peak = db.execute(text("""
        SELECT extract(hour FROM start_time AT TIME ZONE 'Asia/Kolkata')::int AS hr,
               count(*) AS cnt
        FROM sessions WHERE user_id = :uid
        GROUP BY hr ORDER BY cnt DESC LIMIT 1
    """), {"uid": row.user_id}).fetchone()
    print(f"{row.user_id}  total={row.cnt}  peak_ist_hour={peak.hr if peak else '?'}")

db.close()
