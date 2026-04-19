import uuid
from datetime import datetime, timedelta

from app.db.session import SessionLocal
from app.db.models import Event


def seed_events(user_id: str, num_events: int = 50):
    db = SessionLocal()

    base_time = datetime.utcnow()

    events = []
    for i in range(num_events):
        event = Event(
            event_id=str(uuid.uuid4()),
            user_id=user_id,
            timestamp=base_time - timedelta(minutes=i * 10),
            event_type="WATCH",
            title=f"Title_{i % 5}",
            duration=1800,
            device="mobile",
            event_metadata={"autoplay": False}
        )
        events.append(event)

    db.add_all(events)
    db.commit()
    db.close()

    print(f"Seeded {num_events} events for user {user_id}")


if __name__ == "__main__":
    user_id = "demo_user"
    seed_events(user_id)