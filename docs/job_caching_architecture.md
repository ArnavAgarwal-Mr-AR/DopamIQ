# Job Auditing & Cryptographic Caching Architecture

## Overview
To track full-scale application telemetry without bottlenecking the underlying system during repeated uploads of identical Netflix payloads, a highly rigid `Job Tracking` and `Upload Caching` pipeline was structured. It securely logs every user interaction inside the system while mathematically truncating redundant recalculations.

## Database Schema Model: `Job`
Every time the `/upload` API receives a payload request, a `Job` row is spawned. 
Location: `backend/app/db/models.py`

| Field | Type | Description |
|-----------|----------|-------------|
| `job_id` | `String` | Unique UUID primary key. |
| `user_id` | `String` | Foreign mapping linking the execution to the dashboard user. |
| `file_hash` | `String` | **(Crucial)** SHA-256 cryptographic digest of the exact uploaded `.zip` byte array. |
| `file_size_bytes` | `Float` | Track utilization metadata and payload scaling geometry. |
| `status` | `String` | Enum: `completed`, `failed`, or `cached`. |
| `total_events` | `Float` | Number of events processed within the payload (pulled from ML pipeline). |
| `total_sessions` | `Float` | Number of logical viewing sessions collapsed. |
| `score_computed_at` | `TIMESTAMP` | Synchronous temporal index linking scores. |
| `created_at` | `TIMESTAMP` | Record tracking timeline. |

## The Relational Primary Synchronization Anchor
Because `Scores`, `MetaMetrics`, and `Predictions` rely inherently on chronological composite primary keys (`user_id` + `computed_at`), a completely uniform synchronization hook (`sync_timestamp`) is declared right at the start of `run_pipeline()`.

This guarantees that:
```sql
SELECT * from jobs
JOIN scores ON jobs.score_computed_at = scores.computed_at
```
Perfectly links the specific backend scoring results generated directly to the file payload that birthed them, circumventing the need for an explicit auto-incrementing SQL ForeignKey mapping.

## Caching Strategy and Bypass Logic
When a POST request strikes `backend/app/api/routes/upload.py`:
1. **Memory Conversion:** The payload is cast to `BytesIO()`.
2. **Cryptographic Validation:** `hashlib.sha256()` builds a hex-digest of the payload organically.
3. **Collision Polling:** SQLAlchemy pings the exact `(user_id, file_hash, status='completed')` context within the database.
   
**If Cache Hit:**
- The engine skips the heavy ML pipeline scripts.
- To maintain flawless tracking of **"Web App Utilizations"**, the engine immediately creates an audit-trail `Job` logged strictly with `status="cached"`.
- It mirrors the `total_events` / `total_sessions` metrics of the historically successful pipeline execution.
- Returns a successful payload instantly (`{ "status": "success", "cached": True }`).

**If Cache Miss:**
- In-memory buffers trigger `run_pipeline(..., file_hash, file_size)`.
- The pipeline processes natively, injecting the scores and eventually terminating with an insertion of a standard `Job` matrix logged with `status="completed"`.
