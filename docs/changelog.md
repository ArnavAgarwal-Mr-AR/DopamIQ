# Engineering Changelog

> Chronological record of all significant changes, bugs fixed, and architectural decisions made during the Dopamiq forensic hardening sessions (April 2026).

---

## Session 1 — Timezone & Day View Fix

### Problem
The "Day" behavioral graph was rendering as a flat line despite 5,000+ sessions in the database.

### Root Cause
`dependencies.py` defaulted the user identity to `"guest"` when no `X-User-ID` header was present. Since `guest` has zero sessions, every API call returned empty data, and the frontend fell back to synthetic simulation data — making the graph *appear* to show real curves when it was actually fake.

### Fix
- Identified that `localStorage.getItem("netflix_user_id")` drives the `X-User-ID` header in `apiClient.ts`
- The upload flow correctly generates and stores this UUID — the browser just wasn't always sending it
- Temporarily set default to `"demo_user"` for diagnostics, then **reverted to `"guest"`** once the root cause was confirmed (user isolation must be preserved)

---

## Session 2 — SQLAlchemy Caching Error

### Problem
`AttributeError: '_static_cache_key'` crash on the `/api/trends/signals` endpoint.

### Root Cause
SQLAlchemy's internal ORM caching validator attempted to generate cache keys for complex `AT TIME ZONE 'Asia/Kolkata'` expressions, which it cannot handle.

### Fix
Migrated all queries in `trend_service.py` from ORM (`db.query(...)`) to **raw SQL with parameterized `text()`**. Added explicit PostgreSQL type casting (`::int`, `::float`) to prevent `Decimal` type mismatches downstream.

---

## Session 3 — Six Critical Scoring Bugs

Discovered via forensic audit (`scratch/forensic_audit.py`). All bugs caused inaccurate behavioral profiles.

### Bug 1: Timezone — Late Night Ratio Wrong
- **Symptom:** Discipline score was 97 (unrealistically high)
- **Cause:** `_is_late_night()` in `feature_builder.py` compared raw UTC hours. UTC late-night ratio = 4.0% vs IST actual = 25.4%
- **Fix:** Added IST conversion (`timezone(+05:30)`) before hour extraction. Also fixed `ingestion.py` to convert timestamps to IST at parse time and store as naive IST datetimes

### Bug 2: Consistency Always 0
- **Symptom:** Consistency score = 0 for all users
- **Cause:** `variance_usage` was the raw variance of session durations in seconds² (values in the tens of millions), normalized against a max of `1` — always clamped to 1.0, giving `100 - 100 = 0`
- **Fix:** Replaced with **day-of-week entropy** (`consistency_score`). Measures how evenly sessions are distributed across Mon–Sun. Max entropy (uniform) = fully consistent

### Bug 3: Curiosity Underscored
- **Symptom:** Curiosity = 27
- **Cause:** `genre_entropy = 0` because Netflix's `ViewingActivity.csv` contains no Genre column
- **Fix:** Use `log(unique_titles)` as a title diversity proxy. Reflects breadth of content exploration without needing genre data

### Bug 4: Binge Threshold Too Strict
- **Symptom:** Only 3.3% of sessions flagged as binge (178 / 5343)
- **Cause:** Original threshold `num_titles >= 3` per session. Average titles per session is 1.25 — almost no session ever hit 3
- **Fix:** New rule: `num_titles >= 2 OR total_duration > 5400s (1.5h)`. More reflective of real binge behavior

### Bug 5: Duration Normalization Crushed
- **Symptom:** `avg_session_duration` normalized value = 0.024 (near zero)
- **Cause:** Normalizer used max of `4 * 3600 = 14400s`. Actual mean duration is 355s (5.9 min) — giving a near-zero scaled value, collapsing all duration-based scores
- **Fix:** Recalibrated all normalizer ranges based on actual distribution. `avg_session_duration` range set to `0–10800s`. Variance uses coefficient of variation (std/mean) instead of raw variance, range `0–3`

### Bug 6: Focus Flat at 50
- **Symptom:** Focus = 50 for all users regardless of behavior
- **Cause:** Focus formula subtracted `pause_frequency` and `abandonment_rate`, but Netflix CSV has zero PAUSE/REWIND events — so only `completion_rate × weight` contributed. `completion_rate` was also using a flawed proxy
- **Fix:** Dampened `pause_frequency` impact (×10 instead of ×100). Fixed completion proxy to `duration > 900s`

---

## Session 4 — User Isolation Verification

### Problem Identified
After setting `dependencies.py` default to `"demo_user"` during diagnostics, all users were seeing the same person's data.

### Architecture Confirmation
User isolation is correct by design:
1. Upload → `crypto.randomUUID()` generated in browser → stored in `localStorage["netflix_user_id"]`
2. All API calls → `apiClient.ts` reads `localStorage` → sends `X-User-ID` header
3. Backend → `get_current_user()` extracts header → all DB queries filter by `user_id`

The "8 user profiles" in the DB are **8 separate users** who each uploaded their own Netflix CSV. They do not share data.

### Fix
Reverted `dependencies.py` default from `"demo_user"` back to `"guest"`.

---

## Session 5 — Score Recompute

### Problem
Existing sessions in the DB were scored using the buggy pipeline. Scores needed recomputing without re-uploading 5,000+ sessions.

### Challenge
First attempt used Python loops to match events to sessions by timestamp range — timed out on 50,000+ events vs 5,343 sessions (O(n²) complexity).

### Fix
Rewrote `scratch/recompute_scores.py` to use pure SQL aggregation queries. Computes all features directly from the DB in one fast query per user. Completes in seconds for all users.

---

## Current Score Baselines (demo_user, April 2026)

| Score | Value | Interpretation |
|-------|-------|----------------|
| Discipline | 92 | Low late-night watching (IST-corrected: 16.5%) |
| Focus | ~3 | Very low completion rate proxy — likely needs real playback data |
| Curiosity | 67 | Moderate title diversity across 5 years |
| Consistency | ~100 | Very uniform day-of-week spread (5yr dataset evens out) |
| Impulsivity | 16 | Low binge factor, low autoplay |

> **Note:** Focus and Consistency will improve significantly once PlaybackRelatedEvents data (pause/completion signals) is ingested.

---

## Known Remaining Gaps

| Gap | Impact | Required fix |
|-----|--------|-------------|
| No genre data | Curiosity uses proxy | Enrich titles with genre via TMDB/IMDB API |
| No pause/rewind events | Focus always low | Ingest `PlaybackRelatedEvents` file |
| No search logs | Search activity derived | Ingest `SearchHistory` file |
| Focus proxy weak | Score unreliable | Real completion signal needed |
| Consistency ceiling | Always near 100 for multi-year data | Consider recency weighting |
