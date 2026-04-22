# Data Processing — Current State

> **Last updated:** April 2026  
> Reflects the production pipeline after forensic hardening and bug-fix sessions.

---

## 1. Overview

The data processing layer transforms a Netflix `ViewingActivity.csv` export into structured behavioral features, scores, and predictions. In practice, the system **only uses `ViewingActivity`** — other files listed in early specs (Clickstream, SearchHistory, Ratings, etc.) are not yet ingested.

---

## 2. Actual Input

| Field | Source column | Notes |
|-------|--------------|-------|
| Timestamp | `Start Time` | Netflix exports in **UTC**. Converted to IST at ingest. |
| Duration | `Duration` | `HH:MM:SS` → seconds |
| Title | `Title` | Raw show/episode string |
| Device | `Device Type` | Kept as-is, not used for segmentation |
| Autoplay | `Attributes` / `Supplemental Video Type` | Detected if "Autoplay" in Attributes |

> **Device note:** Device type is recorded but plays **no role** in scoring or segmentation. Web and mobile sessions are treated identically.

---

## 3. Pipeline Flow

```
ViewingActivity.csv
       ↓
1. Ingestion (ingestion.py)
   - Parse CSV, strip column whitespace
   - Convert Start Time: UTC → IST (+05:30), store as naive IST datetime
   - Convert Duration: HH:MM:SS → float seconds
   - Drop rows with null timestamp

       ↓
2. Event Normalization (processing.py)
   - Drop events with duration < 10 seconds
   - Detect autoplay flag from Attributes column
   - Assign event_type = "WATCH" for all rows
   - completion proxy: duration > 900s (15 min) = completed

       ↓
3. Sessionization (sessionization.py)
   - Sort events by timestamp
   - Gap threshold: 30 minutes between events = new session
   - binge_flag = True if session has ≥2 unique titles OR duration > 5400s (1.5h)
   - Session output: {session_id, start_time, end_time, duration, num_titles, binge_flag}

       ↓
4. Feature Engineering (feature_builder.py)
   - All temporal calculations in IST (timezone-aware)
   - Late night = 22:00–05:00 IST
   - Consistency = day-of-week entropy (how evenly spread across Mon–Sun)
   - Curiosity proxy = log(unique_titles) — genre data absent from Netflix CSV
   - Rewatch ratio, novelty score, binge factor, autoplay ratio, etc.

       ↓
5. Feature Normalization (feature_normalizer.py)
   - All features scaled to [0, 1]
   - Ranges calibrated to real Netflix viewing distributions
   - avg_session_duration: 0–10800s (3h)
   - genre_entropy: 0–5 (title diversity log scale)
   - variance_usage: coefficient of variation, range 0–3

       ↓
6. Scoring (scoring_engine.py)
   - Discipline, Focus, Curiosity, Consistency, Impulsivity
   - Output: 0–100 float scores

       ↓
7. Prediction (predictor.py)
   - click_probability, binge_probability, abandonment_probability (0.0–1.0)
   - expected_duration (minutes)

       ↓
8. DB Persistence (pipeline_runner.py)
   - Tables: events, sessions, features, scores, predictions, meta_metrics, jobs
   - All records tagged with user_id from X-User-ID header
```

---

## 4. Known Limitations of Current Input

| Feature | Status | Reason |
|---------|--------|--------|
| Genre entropy | Proxy only | Netflix CSV has no Genre column — uses title diversity instead |
| Pause / Rewind | Always 0 | Not captured in ViewingActivity |
| Search activity | Derived | Estimated from novelty score, not real search logs |
| Decision time | Neutral (0.5) | No clickstream data available |
| Completion rate | Proxy | "Completed" = duration > 15 min (no real completion signal) |

---

## 5. Sessionization Rules

| Rule | Value | Rationale |
|------|-------|-----------|
| Session gap | 30 min | Standard industry threshold |
| Binge flag | ≥2 titles OR >1.5h | Old threshold (≥3 titles) was too strict — avg 1.25 titles/session |
| Min event duration | 10 sec | Filters accidental clicks and trailers |

---

## 6. Timezone Handling

**Critical:** Netflix exports timestamps in UTC. All storage and downstream feature computation assumes **IST (Asia/Kolkata, +05:30)**.

- Conversion happens at **ingestion time** in `ingestion.py`
- Stored in DB as naive IST datetimes
- SQL trend queries use `AT TIME ZONE 'Asia/Kolkata'` as a safety net for any legacy UTC-stored data
- `feature_builder.py` applies IST offset before computing late-night ratios

---

## 7. User Isolation

- Each upload generates a `crypto.randomUUID()` in the browser
- Stored in `localStorage` as `netflix_user_id`
- Sent as `X-User-ID` header on every API request
- All DB queries filter by `user_id` — no data ever crosses between users
- Default fallback: `"guest"` (zero data) if header is missing

---

## 8. Data Coverage

System is designed for and tested against:
- Date range: 2021–2026
- Session count: ~5,000+ sessions per user
- All-time historical analysis (no date windowing applied)
