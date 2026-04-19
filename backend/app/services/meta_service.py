from app.db.session import SessionLocal
from app.db.models import MetaMetrics

def get_meta_metrics(user_id: str):
    db = SessionLocal()
    try:
        # Fetch the most recent meta metrics dynamically from postgres
        meta_record = db.query(MetaMetrics).filter(MetaMetrics.user_id == user_id).order_by(MetaMetrics.computed_at.desc()).first()
        
        if not meta_record:
            return None
            
        return {
            "predictability": meta_record.predictability,
            "drift": meta_record.drift,
            "susceptibility": meta_record.susceptibility
        }
    finally:
        db.close()