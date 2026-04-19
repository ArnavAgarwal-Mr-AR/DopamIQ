from datetime import datetime, timedelta
from app.db.session import SessionLocal
from app.db.models import Score, Session as SessionModel
from sqlalchemy import func

def get_trends(user_id: str):
    db = SessionLocal()
    try:
        # 1. Aggregate Score History By Day
        score_results = db.query(
            func.date_trunc('day', Score.computed_at).label('day'),
            func.avg(Score.discipline).label('discipline'),
            func.avg(Score.focus).label('focus'),
            func.avg(Score.curiosity).label('curiosity'),
            func.avg(Score.consistency).label('consistency'),
            func.avg(Score.impulsivity).label('impulsivity')
        ).filter(Score.user_id == user_id)\
         .group_by(func.date_trunc('day', Score.computed_at))\
         .order_by(func.date_trunc('day', Score.computed_at)).all()

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

        # 2. Daily Watch Heatmap Metrics
        heatmap_results = db.query(
            func.extract('dow', SessionModel.start_time).label('dow'),
            func.extract('hour', SessionModel.start_time).label('hour'),
            func.count(SessionModel.session_id).label('value')
        ).filter(SessionModel.user_id == user_id)\
         .group_by(func.extract('dow', SessionModel.start_time), func.extract('hour', SessionModel.start_time))\
         .order_by(func.extract('dow', SessionModel.start_time).asc(), func.extract('hour', SessionModel.start_time).asc()).all()

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