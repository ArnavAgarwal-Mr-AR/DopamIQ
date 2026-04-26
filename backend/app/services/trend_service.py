import math
import logging
from datetime import datetime, timedelta
from app.db.session import SessionLocal
from app.db.models import Score, Session as SessionModel
from sqlalchemy import func, literal_column, text

logger = logging.getLogger(__name__)

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
        logger.info(f"FETCH_SIGNALS: User={user_id} View={view}")

        if view == "day":
            # Hourly distribution across all-time history
            sql = text("""
                SELECT
                    extract(hour FROM start_time)::int          AS hour_label,
                    avg(total_duration)::float                  AS avg_duration,
                    avg(binge_flag::int)::float                 AS binge_rate,
                    count(session_id)                           AS density
                FROM sessions
                WHERE user_id = :user_id
                GROUP BY hour_label
                ORDER BY hour_label
            """)
            results = db.execute(sql, {"user_id": user_id}).fetchall()
            
            if not results:
                logger.warning(f"No day data for user {user_id}")
                return [{"label": f"{i:02d}", "prob": 0, "duration": 0, "binge": 0} for i in range(24)]

            max_density = max([r.density for r in results], default=1)

            for i in range(24):
                found = next((r for r in results if r.hour_label == i), None)
                if found:
                    signals.append({
                        "label": f"{i:02d}",
                        "prob": round((found.density / max_density) * 100),
                        "duration": round((found.avg_duration or 0) / 60, 1),
                        "binge": round((found.binge_rate or 0) * 100),
                    })
                else:
                    signals.append({"label": f"{i:02d}", "prob": 0, "duration": 0.0, "binge": 0})

        elif view == "month":
            # Get the last 30 distinct days of activity
            sql = text("""
                WITH active_days AS (
                    SELECT DISTINCT date_trunc('day', start_time)::date as active_date
                    FROM sessions
                    WHERE user_id = :user_id
                    ORDER BY active_date DESC
                    LIMIT 30
                )
                SELECT
                    date_trunc('day', s.start_time)::date        AS label,
                    avg(s.total_duration)::float                 AS avg_duration,
                    avg(s.binge_flag::int)::float                AS binge_rate,
                    count(s.session_id)                          AS density
                FROM sessions s
                JOIN active_days ad ON date_trunc('day', s.start_time)::date = ad.active_date
                WHERE s.user_id = :user_id
                GROUP BY label
                ORDER BY label
            """)
            results = db.execute(sql, {"user_id": user_id}).fetchall()
            
            if not results: 
                logger.warning(f"No month data for user {user_id}")
                return []
            
            max_density = max([r.density for r in results], default=1)
            for r in results:
                signals.append({
                    "label": str(r.label),
                    "prob": round((r.density / max_density) * 100),
                    "duration": round((r.avg_duration or 0) / 60, 1),
                    "binge": round((r.binge_rate or 0) * 100),
                })

        else: # view == "year"
            # Past 12 active months
            sql = text("""
                SELECT
                    date_trunc('month', start_time)::date       AS label,
                    avg(total_duration)::float                  AS avg_duration,
                    avg(binge_flag::int)::float                 AS binge_rate,
                    count(session_id)                           AS density
                FROM sessions
                WHERE user_id = :user_id
                GROUP BY label
                ORDER BY label DESC
                LIMIT 12
            """)
            results = db.execute(sql, {"user_id": user_id}).fetchall()
            
            # Reverse to plot chronologically (oldest to newest)
            results = results[::-1]
            
            if not results: 
                logger.warning(f"No year data for user {user_id}")
                return []
            
            max_density = max([r.density for r in results], default=1)
            for r in results:
                signals.append({
                    "label": r.label.strftime("%Y-%m"),
                    "prob": round((r.density / max_density) * 100),
                    "duration": round((r.avg_duration or 0) / 60, 1),
                    "binge": round((r.binge_rate or 0) * 100),
                })

        logger.info(f"SIGNALS_READY: Count={len(signals)}")
        return signals
    finally:
        db.close()
