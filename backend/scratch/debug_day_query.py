from app.db.session import SessionLocal
from sqlalchemy import text
import json

db = SessionLocal()
user_id = "demo_user"

sql = text("""
    SELECT 
        extract(hour from start_time AT TIME ZONE 'Asia/Kolkata') as hour_label,
        avg(total_duration) as avg_duration,
        avg(binge_flag::int) as binge_rate,
        count(session_id) as density
    FROM sessions
    WHERE user_id = :user_id
    GROUP BY hour_label
    ORDER BY hour_label
""")

results = db.execute(sql, {"user_id": user_id}).fetchall()
db.close()

print(f"Found {len(results)} rows for user {user_id}")
for r in results:
    print(f"Hour: {r.hour_label} (Type: {type(r.hour_label)}), Density: {r.density}")
