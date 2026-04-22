# ML Pipeline — Current State

> **Last updated:** April 2026

---

## 1. Pipeline Overview

```
ViewingActivity.csv → Ingest → Sessionize → Features → Normalize → Score → Predict → Store
```

All steps run synchronously on upload via `pipeline_runner.py`.

---

## 2. Feature Engineering

Computed in `feature_builder.py` from session list.

| Feature | Description | Data source |
|---------|-------------|-------------|
| `avg_session_duration` | Mean session length (seconds) | sessions.total_duration |
| `late_night_ratio` | Fraction of sessions starting 22:00–05:00 **IST** | sessions.start_time (IST-converted) |
| `binge_factor` | Fraction of sessions with binge_flag=True | sessions.binge_flag |
| `autoplay_ratio` | Fraction of sessions with ≥1 autoplay event | events.metadata.autoplay |
| `completion_rate` | Fraction of events watched >15 min | events.duration |
| `novelty_score` | 1 − rewatch_ratio (unique titles / total watches) | events.title |
| `rewatch_ratio` | Fraction of watched titles seen before | events.title |
| `genre_entropy` | log(unique_titles) — title diversity proxy | events.title |
| `consistency_score` | Day-of-week entropy (0=erratic, 1=uniform spread) | sessions.start_time DOW |
| `variance_usage` | Coefficient of variation of session durations | sessions.total_duration |
| `binge_factor` | Binge sessions / total sessions | sessions.binge_flag |
| `abandonment_rate` | 1 − completion_rate | derived |
| `search_activity` | Derived: novelty × 0.8 + 0.2 | derived proxy |
| `inverse_decision_time` | Neutral 0.5 (no clickstream data) | hardcoded |

---

## 3. Feature Normalization

All features scaled to `[0, 1]` in `feature_normalizer.py`.

| Feature | Min | Max | Notes |
|---------|-----|-----|-------|
| avg_session_duration | 0 | 10800s | 3h cap |
| late_night_ratio | 0 | 1 | |
| genre_entropy | 0 | 5 | log scale of title diversity |
| variance_usage | 0 | 3 | coefficient of variation |
| consistency_score | 0 | 1 | already normalized |
| pause_frequency | 0 | 5 | per session |
| avg_titles_per_session | 0 | 5 | |

---

## 4. Scoring Engine

Computed in `scoring_engine.py` from normalized features. Output: `0–100`.

### Discipline
```
100 - (late_night_ratio×40 + binge_factor×35 + autoplay_ratio×25)
```
Higher = more controlled viewing habits.

### Focus
```
completion_rate×70 - pause_frequency×10(dampened) - abandonment_rate×30
```
Higher = finishes what they start.

### Curiosity
```
genre_entropy×40 + novelty_score×40 + search_activity×20
```
Higher = explores diverse, new content.

### Consistency
```
consistency_score × 100
```
Based on day-of-week entropy. Higher = watches on a regular schedule.

### Impulsivity
```
autoplay_ratio×35 + inverse_decision_time×35 + binge_factor×30
```
Higher = more reactive, less intentional viewing.

> **Note:** Weights live in `scoring/weights.py` and can be tuned independently.

---

## 5. Prediction Models

Located in `prediction/models/`. Rule-based (no trained ML yet).

| Model | Output | Key inputs |
|-------|--------|-----------|
| `ClickModel` | click_probability (0–1) | curiosity, novelty_score, impulsivity |
| `BingeModel` | binge_probability (0–1) | late_night_ratio, impulsivity, binge_factor |
| `AbandonmentModel` | abandonment_probability (0–1) | abandonment_rate, focus |
| `DurationModel` | expected_duration (minutes) | avg_session_duration, binge_factor, focus |

---

## 6. Binge Flag Logic

| Version | Rule | Issue |
|---------|------|-------|
| Original | `num_titles >= 3` | Too strict — avg is 1.25 titles/session → only 3.3% flagged |
| **Current** | `num_titles >= 2 OR duration > 5400s` | Realistic for actual Netflix viewing |

---

## 7. Trend / Signal Queries

`trend_service.py` uses **raw SQL with parameterized `text()`** (not ORM) to avoid SQLAlchemy `_static_cache_key` errors on complex `AT TIME ZONE` expressions.

- **Day view:** Groups sessions by hour of day (IST), returns 24 hourly buckets
- **Month view:** Groups sessions by calendar day, returns all days in history

---

## 8. Recompute

Scores can be recomputed for all users without re-uploading the CSV using:
```
python scratch/recompute_scores.py
```
Uses SQL aggregation — completes in seconds per user.