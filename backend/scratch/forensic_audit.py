"""
Full forensic audit of the current data pipeline state.
Checks: session durations, timezone correctness, scoring accuracy, prediction accuracy
"""
from app.db.session import SessionLocal
from sqlalchemy import text
import statistics

db = SessionLocal()
user_id = "demo_user"

print("=" * 60)
print("DOPAMIQ FORENSIC DATA AUDIT")
print("=" * 60)

# 1. Session Duration Analysis
r = db.execute(text("""
    SELECT
        count(*) as total,
        avg(total_duration) as avg_dur,
        min(total_duration) as min_dur,
        max(total_duration) as max_dur,
        avg(num_titles) as avg_titles,
        sum(case when binge_flag then 1 else 0 end) as binge_count
    FROM sessions WHERE user_id = :uid
"""), {"uid": user_id}).fetchone()

print(f"\n[SESSIONS]")
print(f"  Total Sessions    : {r.total}")
print(f"  Avg Duration      : {r.avg_dur:.1f} sec  =  {r.avg_dur/60:.1f} min")
print(f"  Min Duration      : {r.min_dur:.1f} sec  =  {r.min_dur/60:.1f} min")
print(f"  Max Duration      : {r.max_dur:.1f} sec  =  {r.max_dur/3600:.1f} hr")
print(f"  Avg Titles/Session: {r.avg_titles:.2f}")
print(f"  Binge Sessions    : {r.binge_count} ({r.binge_count/r.total*100:.1f}%)")

# 2. Hourly Watch Pattern (IST)
print(f"\n[HOURLY PATTERN - IST]")
results = db.execute(text("""
    SELECT
        (extract(hour from start_time AT TIME ZONE 'Asia/Kolkata'))::int as hr,
        count(*) as cnt,
        avg(total_duration) as avg_dur
    FROM sessions WHERE user_id = :uid
    GROUP BY hr ORDER BY hr
"""), {"uid": user_id}).fetchall()

for r in results:
    bar = "#" * (r.cnt // 20)
    print(f"  {r.hr:02d}:00  {r.cnt:4d} sessions  {r.avg_dur/60:5.1f}m avg  {bar}")

# 3. Late-night ratio (the feature_builder uses UTC hours - BUG CHECK)
r_utc = db.execute(text("""
    SELECT count(*) as late_utc FROM sessions
    WHERE user_id = :uid
    AND (extract(hour from start_time) >= 23 OR extract(hour from start_time) < 3)
"""), {"uid": user_id}).fetchone()

r_ist = db.execute(text("""
    SELECT count(*) as late_ist FROM sessions
    WHERE user_id = :uid
    AND (extract(hour from start_time AT TIME ZONE 'Asia/Kolkata') >= 23
         OR extract(hour from start_time AT TIME ZONE 'Asia/Kolkata') < 3)
"""), {"uid": user_id}).fetchone()

total = db.execute(text("SELECT count(*) FROM sessions WHERE user_id=:uid"), {"uid": user_id}).fetchone()[0]
print(f"\n[TIMEZONE BUG CHECK]")
print(f"  Late night (UTC raw) : {r_utc.late_utc} / {total}  = {r_utc.late_utc/total*100:.1f}%")
print(f"  Late night (IST)     : {r_ist.late_ist} / {total}  = {r_ist.late_ist/total*100:.1f}%")
print(f"  >> Scoring engine uses UTC raw timestamps - DISCIPLINE SCORE IS WRONG")

# 4. Current stored scores
r_score = db.execute(text("""
    SELECT discipline, focus, curiosity, consistency, impulsivity
    FROM scores WHERE user_id = :uid
    ORDER BY computed_at DESC LIMIT 1
"""), {"uid": user_id}).fetchone()

print(f"\n[STORED SCORES (latest)]")
if r_score:
    print(f"  Discipline   : {r_score.discipline}")
    print(f"  Focus        : {r_score.focus}")
    print(f"  Curiosity    : {r_score.curiosity}")
    print(f"  Consistency  : {r_score.consistency}")
    print(f"  Impulsivity  : {r_score.impulsivity}")

# 5. Binge flag accuracy check
r_binge = db.execute(text("""
    SELECT
        count(*) as total,
        sum(case when binge_flag then 1 else 0 end) as flagged,
        avg(num_titles) as avg_titles
    FROM sessions WHERE user_id = :uid
"""), {"uid": user_id}).fetchone()

print(f"\n[BINGE FLAG ACCURACY]")
print(f"  Current: binge if num_titles >= 3 (hardcoded)")
print(f"  Sessions with binge_flag: {r_binge.flagged}/{r_binge.total}")
print(f"  Avg titles per session: {r_binge.avg_titles:.2f}")
print(f"  >> Note: binge_flag is computed at sessionization time from titles count")

# 6. Feature store check
r_feat = db.execute(text("""
    SELECT values FROM features WHERE user_id = :uid
    ORDER BY computed_at DESC LIMIT 1
"""), {"uid": user_id}).fetchone()

print(f"\n[STORED FEATURES (latest)]")
if r_feat:
    import json
    feats = r_feat.values
    for k, v in feats.items():
        print(f"  {k:<30}: {v:.4f}")

db.close()
print("\n" + "=" * 60)
