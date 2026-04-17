import uuid
from sqlalchemy import Column, String, Float, Boolean, TIMESTAMP, JSON
from sqlalchemy.sql import func

from app.db.postgres import Base


class Event(Base):
    __tablename__ = "events"

    event_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, index=True)
    timestamp = Column(TIMESTAMP, index=True)
    event_type = Column(String)
    title = Column(String)
    duration = Column(Float)
    device = Column(String)
    metadata = Column(JSON)


class Session(Base):
    __tablename__ = "sessions"

    session_id = Column(String, primary_key=True)
    user_id = Column(String, index=True)
    start_time = Column(TIMESTAMP, index=True)
    end_time = Column(TIMESTAMP)
    total_duration = Column(Float)
    num_titles = Column(Float)
    binge_flag = Column(Boolean)


class Feature(Base):
    __tablename__ = "features"

    feature_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, index=True)

    computed_at = Column(TIMESTAMP, server_default=func.now(), index=True)

    window_start = Column(TIMESTAMP, nullable=True)
    window_end = Column(TIMESTAMP, nullable=True)

    feature_version = Column(Float, default=1)
    values = Column(JSON)


class Score(Base):
    __tablename__ = "scores"

    user_id = Column(String, primary_key=True)
    computed_at = Column(TIMESTAMP, primary_key=True, server_default=func.now())

    discipline = Column(Float)
    focus = Column(Float)
    curiosity = Column(Float)
    consistency = Column(Float)
    impulsivity = Column(Float)


class Prediction(Base):
    __tablename__ = "predictions"

    user_id = Column(String, primary_key=True)
    computed_at = Column(TIMESTAMP, primary_key=True, server_default=func.now())

    click_probability = Column(Float)
    abandonment_probability = Column(Float)
    binge_probability = Column(Float)
    expected_duration = Column(Float)


class MetaMetrics(Base):
    __tablename__ = "meta_metrics"

    user_id = Column(String, primary_key=True)
    computed_at = Column(TIMESTAMP, primary_key=True, server_default=func.now())

    predictability = Column(Float)
    drift = Column(Float)
    susceptibility = Column(Float)


class LLMOutput(Base):
    __tablename__ = "llm_outputs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, index=True)

    type = Column(String)  # explain / simulate / report
    input = Column(JSON)
    output = Column(String)

    created_at = Column(TIMESTAMP, server_default=func.now())