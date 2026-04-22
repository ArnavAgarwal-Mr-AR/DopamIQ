from datetime import datetime, timedelta
from app.db.session import SessionLocal
from app.db.models import Score, Session as SessionModel
from sqlalchemy import func, literal_column, text

def get_trends(user_id: str):
    db = SessionLocal()
    try:
        # Aggregating Score History using Raw SQL for stability
        sql = text("""
            SELECT 
                date_trunc('day', computed_at AT TIME ZONE 'Asia/Kolkata') as day,
                (avg(discipline))::float as discipline,
                (avg(focus))::float as focus,
                (avg(curiosity))::float as curiosity,
                (avg(consistency))::float as consistency,
                (avg(impulsivity))::float as impulsivity
            FROM scores
            WHERE user_id = :user_id
            GROUP BY day
            ORDER BY day
        """)
        score_results = db.execute(sql, {"user_id": user_id}).fetchall()

        trends = []
        for r in score_results:
            trends.append({
                "date": r.day.strftime("%Y-%m-%d"),
                "discipline": round(r.discipline, 2),
                "focus": round(r.focus, 2),
                "curiosity": round(r.curiosity, 2),
                "consistency": round(r.consistency, 2),
                "impulsivity": round(r.impulsivity, 2),
            })

        # Heatmap using Raw SQL
        sql_heatmap = text("""
            SELECT 
                (extract(dow from start_time AT TIME ZONE 'Asia/Kolkata'))::int as dow,
                (extract(hour from start_time AT TIME ZONE 'Asia/Kolkata'))::int as hour,
                count(session_id) as value
            FROM sessions
            WHERE user_id = :user_id
            GROUP BY dow, hour
            ORDER BY dow, hour
        """)
        heatmap_results = db.execute(sql_heatmap, {"user_id": user_id}).fetchall()

        days_map = {0: "Sun", 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat"}
        
        # Initialize an empty matrix of exactly 7 days x 24 hours to guarantee no gaps in the UI layer
        heatmap = []
        for d in range(7):
            for h in range(24):
                # Search for the query payload
                found = next((r for r in heatmap_results if int(r.dow) == d and int(r.hour) == h), None)
                val = int(found.value) if found else 0
                heatmap.append({
                    "x": f"{h}:00",
                    "y": days_map.get(d, "Unknown"),
                    "value": val
                })

        return {
            "score_trends": trends,
            "heatmap": heatmap
        }
    finally:
        db.close()

def get_behavioral_signals(user_id: str, view: str = "day"):
    db = SessionLocal()
    try:
        signals = []
        if view == "day":
            sql = text("""
                SELECT 
                    (extract(hour from start_time AT TIME ZONE 'Asia/Kolkata'))::int as hour_label,
                    (avg(total_duration))::float as avg_duration,
                    (avg(binge_flag::int))::float as binge_rate,
                    count(session_id) as density
                FROM sessions
                WHERE user_id = :user_id
                GROUP BY hour_label
                ORDER BY hour_label
            """)
            results = db.execute(sql, {"user_id": user_id}).fetchall()
            
            max_density = max([r.density for r in results]) if results else 1
            for i in range(24):
                label_val = f"{i:02d}"
                found = next((r for r in results if r.hour_label == i), None)
                if found:
                    # Convert to minutes with 1 decimal place for precision
                    dur_mins = (found.avg_duration or 0) / 60
                    signals.append({
                        "label": label_val,
                        "prob": round((found.density / max_density) * 100),
                        "duration": round(dur_mins, 1),
                        "binge": round((found.binge_rate or 0) * 100)
                    })
                else:
                    signals.append({"label": label_val, "prob": 0, "duration": 0, "binge": 0})
        else:
            sql = text("""
                SELECT 
                    date_trunc('day', start_time AT TIME ZONE 'Asia/Kolkata') as label,
                    (avg(total_duration))::float as avg_duration,
                    (avg(binge_flag::int))::float as binge_rate,
                    count(session_id) as density
                FROM sessions
                WHERE user_id = :user_id
                GROUP BY label
                ORDER BY label
            """)
            results = db.execute(sql, {"user_id": user_id}).fetchall()
            
            max_density = max([r.density for r in results]) if results else 1
            for r in results:
                dur_mins = (r.avg_duration or 0) / 60
                signals.append({
                    "label": r.label.strftime("%Y-%m-%d"),
                    "prob": round((r.density / max_density) * 100),
                    "duration": round(dur_mins, 1),
                    "binge": round((r.binge_rate or 0) * 100)
                })
        
        return signals
    finally:
        db.close()