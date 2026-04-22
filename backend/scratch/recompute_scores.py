"""
Recompute all scores from session-level SQL aggregation.
Fixes: completion_rate (session-based), meta_metrics (now included).
"""
from app.db.session import SessionLocal
from app.db.models import Feature, Score, Prediction, MetaMetrics
from app.features.feature_normalizer import normalize_features
from app.scoring.scoring_engine import compute_scores
from app.prediction.predictor import predict
from app.meta.susceptibility import compute_susceptibility
from app.meta.drift import compute_drift
from sqlalchemy import text
from datetime import datetime
import math

db = SessionLocal()
users = db.execute(text("SELECT DISTINCT user_id FROM sessions")).fetchall()
print(f"Recomputing {len(users)} users")

for (user_id,) in users:
    print(f"\n{user_id[:8]}...")

    # ── Session-level aggregation with personalized completion threshold ──
    r = db.execute(text("""
        WITH user_avg AS (
            SELECT avg(total_duration) AS avg_dur
            FROM sessions WHERE user_id = :uid
        )
        SELECT
            count(*)                                            AS total_sessions,
            user_avg.avg_dur                                    AS avg_dur,
            stddev(s.total_duration)                            AS std_dur,
            avg(s.num_titles)                                   AS avg_titles,
            sum(CASE WHEN s.binge_flag THEN 1 ELSE 0 END)::float
                / NULLIF(count(*), 0)                          AS binge_factor,
            sum(CASE WHEN (extract(hour FROM s.start_time) >= 22
                           OR extract(hour FROM s.start_time) < 5)
                     THEN 1 ELSE 0 END)::float
                / NULLIF(count(*), 0)                          AS late_night_ratio,
            -- Personalized: completed = session > 60% of user's own avg duration
            sum(CASE WHEN s.total_duration > (user_avg.avg_dur * 0.6)
                     THEN 1 ELSE 0 END)::float
                / NULLIF(count(*), 0)                          AS completion_rate,
            count(DISTINCT date_trunc('day', s.start_time))    AS active_days,
            extract('day' FROM (max(s.start_time) - min(s.start_time))) + 1
                                                               AS total_span_days
        FROM sessions s, user_avg
        WHERE s.user_id = :uid
        GROUP BY user_avg.avg_dur
    """), {"uid": user_id}).fetchone()

    # ── Unique title diversity (for curiosity/novelty) ────────────
    er = db.execute(text("""
        SELECT
            count(*)                  AS total_events,
            count(DISTINCT title)     AS unique_titles
        FROM events
        WHERE user_id = :uid AND event_type = 'WATCH'
    """), {"uid": user_id}).fetchone()

    # ── Recency-weighted DOW distribution for consistency ─────────
    # Recent 90 days → weight 3×, last year → 2×, older → 1×
    # This prevents 5-year data from saturating entropy to max
    dow_rows = db.execute(text("""
        SELECT
            extract(dow FROM start_time)::int AS dow,
            sum(CASE
                WHEN start_time >= NOW() - INTERVAL '90 days'  THEN 3
                WHEN start_time >= NOW() - INTERVAL '365 days' THEN 2
                ELSE 1
            END) AS weighted_cnt
        FROM sessions WHERE user_id = :uid
        GROUP BY dow ORDER BY dow
    """), {"uid": user_id}).fetchall()

    total_s = sum(row.weighted_cnt for row in dow_rows)
    if total_s > 0 and len(dow_rows) > 1:
        dow_probs = [row.weighted_cnt / total_s for row in dow_rows]
        entropy = -sum(p * math.log(p) for p in dow_probs if p > 0)
        max_entropy = math.log(7)
        consistency_score = min(0.95, entropy / max_entropy)  # hard cap at 95
    else:
        consistency_score = 0.3

    avg_dur = float(r.avg_dur or 0)
    std_dur = float(r.std_dur or 0)
    cv = (std_dur / avg_dur) if avg_dur > 0 else 1.0

    total_events = int(er.total_events or 1)
    unique_titles = int(er.unique_titles or 1)
    completion_rate = float(r.completion_rate or 0)

    novelty_score = min(1.0, unique_titles / total_events)
    rewatch_ratio = 1.0 - novelty_score
    title_entropy = math.log(unique_titles + 1)

    active_days = int(r.active_days or 1)
    span_days = max(1.0, float(r.total_span_days or 1))
    active_day_ratio = min(1.0, active_days / span_days)

    raw_features = {
        "avg_session_duration":   avg_dur,           # raw seconds
        "late_night_ratio":       float(r.late_night_ratio or 0),
        "avg_titles_per_session": float(r.avg_titles or 1),
        "max_binge_length":       float(r.avg_titles or 1),
        "autoplay_ratio":         0.0,
        "completion_rate":        completion_rate,   # session-level: >15min = complete
        "pause_frequency":        0.0,
        "rewind_ratio":           0.0,
        "genre_entropy":          title_entropy,
        "rewatch_ratio":          rewatch_ratio,
        "novelty_score":          novelty_score,
        "variance_usage":         min(3.0, cv),
        "consistency_score":      consistency_score,
        "binge_factor":           float(r.binge_factor or 0),
        "abandonment_rate":       1.0 - completion_rate,
        "search_activity":        min(1.0, novelty_score * 0.8 + 0.2),
        "inverse_decision_time":  0.5,
        "active_day_ratio":       active_day_ratio,
    }

    features = normalize_features(raw_features)
    scores = compute_scores(features)
    predictions = predict(scores, features)

    # ── Meta metrics (computed from features, no event list needed) ──
    susceptibility = compute_susceptibility(features)
    drift = compute_drift(features, features)  # 0 drift vs self (no baseline yet)
    # Predictability: inverse of novelty × consistency
    predictability = round((1 - raw_features["novelty_score"]) * consistency_score * 100, 1)

    print(f"  D:{scores['discipline']} F:{scores['focus']} C:{scores['curiosity']} Cs:{scores['consistency']} I:{scores['impulsivity']}")
    print(f"  completion:{raw_features['completion_rate']:.3f} novelty:{raw_features['novelty_score']:.3f} binge:{raw_features['binge_factor']:.3f}")
    print(f"  duration_pred:{predictions['expected_duration']:.1f}m  susceptibility:{susceptibility:.1f}  predictability:{predictability:.1f}")

    sync_ts = datetime.utcnow()
    db.execute(text("DELETE FROM scores WHERE user_id = :uid"), {"uid": user_id})
    db.execute(text("DELETE FROM features WHERE user_id = :uid"), {"uid": user_id})
    db.execute(text("DELETE FROM predictions WHERE user_id = :uid"), {"uid": user_id})
    db.execute(text("DELETE FROM meta_metrics WHERE user_id = :uid"), {"uid": user_id})

    db.add(Score(user_id=user_id, computed_at=sync_ts,
                 discipline=scores["discipline"], focus=scores["focus"],
                 curiosity=scores["curiosity"], consistency=scores["consistency"],
                 impulsivity=scores["impulsivity"]))
    db.add(Feature(user_id=user_id, computed_at=sync_ts, values=raw_features))
    db.add(Prediction(user_id=user_id, computed_at=sync_ts,
                      click_probability=predictions["click_probability"],
                      abandonment_probability=predictions["abandonment_probability"],
                      binge_probability=predictions["binge_probability"],
                      expected_duration=predictions["expected_duration"]))
    db.add(MetaMetrics(user_id=user_id, computed_at=sync_ts,
                       predictability=predictability,
                       drift=drift,
                       susceptibility=susceptibility))
    db.commit()
    print(f"  Saved OK")

db.close()
print("\nDone.")
