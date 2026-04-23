import hashlib
import json
import logging
from app.config.settings import settings

logger = logging.getLogger(__name__)

def explain(scores: dict, predictions: dict, user_id: str = "demo_user"):
    # Deterministic Rule-Based Engine
    
    traits = []
    title = "Balanced Viewer"
    
    # Archetype Classification (from ml_specification.md)
    if scores.get("curiosity", 0) > 70 and scores.get("impulsivity", 0) > 60:
        title = "Curious Binger"
    elif scores.get("discipline", 0) > 70 and scores.get("focus", 0) > 70:
        title = "Intentional Optimizer"
    elif scores.get("consistency", 0) > 70:
        title = "Habitual Watcher"
    elif scores.get("focus", 0) < 40 and scores.get("impulsivity", 0) > 60:
        title = "Restless Scroller"

    # Trait mapping
    if scores.get("focus", 0) > 75:
        traits.append("Deep Focus")
    elif scores.get("focus", 0) < 30:
        traits.append("Easily Distracted")
        
    if scores.get("discipline", 0) < 40:
        traits.append("Night Owl")
        
    if scores.get("curiosity", 0) > 60:
        traits.append("Explorer")

    if not traits:
        traits.append("Moderate Consumer")

    # Predictive Insight
    binge_prob = predictions.get("binge_probability", 0)
    summary = f"The algorithm has memorized the contours of your boredom. It sees you as a '{title}', "
    
    if binge_prob > 0.6:
        summary += "anticipating that your next search will inevitably bleed into a binge. It knows you are seeking an escape that the interface is only too happy to provide."
    elif binge_prob < 0.2:
        summary += "watching as you maintain a disciplined distance, ending your sessions with a finality that the server usually fails to predict."
    else:
        summary += "keeping you in a steady state of moderate engagement—a predictable orbit that balances between discovery and comfort."

    summary += f" Ultimately, the data suggests your nights are governed more by {('biological rhythm' if scores.get('discipline', 0) > 60 else 'platform hooks')} than by conscious choice."

    return {
        "title": title,
        "summary": summary,
        "traits": traits
    }

from app.services.trend_service import get_behavioral_signals

def simulate(scenario: dict, scores: dict = None, user_id: str = "demo_user", mode: str = "day"):
    # Rule based simulation with Comparative Forensics
    scores = scores or {}
    mode = scenario.get("mode", mode) # Detect if mode passed in payload
    
    # Fetch All-Time Comparative Signals
    all_time_signals = get_behavioral_signals(user_id, view=mode)
        # Calculate General Averages (Global Baselines)
    if all_time_signals:
        global_avg_prob = sum(s["prob"] for s in all_time_signals) / len(all_time_signals)
        global_avg_dur = sum(s["duration"] for s in all_time_signals) / len(all_time_signals)
        global_avg_binge = sum(s["binge"] for s in all_time_signals) / len(all_time_signals)
        
        # Calculate Active Cycle Averages (Last 20% of data or last 7 points)
        active_sample = all_time_signals[-7:] if len(all_time_signals) > 7 else all_time_signals
        active_avg_dur = sum(s["duration"] for s in active_sample) / len(active_sample)
        active_avg_prob = sum(s["prob"] for s in active_sample) / len(active_sample)
    else:
        global_avg_prob, global_avg_dur, global_avg_binge = 30, 45, 20
        active_avg_dur, active_avg_prob = 45, 30

    # Simulation Snapshot Logic
    time_str = scenario.get("time", "").upper()
    is_late = any(h in time_str for h in ["10 PM", "11 PM", "12 PM", "1 AM", "2 AM", "3 AM"])
    
    discipline = scores.get("discipline", 50)
    
    # Advanced Comparative Synthesis — distinct logic per view
    analysis_blocks = []
    logger.info(f"INTERNAL DEBUG: Processing simulation for User {user_id} | Mode: {mode} | Signals Count: {len(all_time_signals) if all_time_signals else 0}")

    if not all_time_signals or all(s["prob"] == 0 for s in all_time_signals):
        analysis_blocks.append(
            f"PLATFORM ARCHITECTURE NOTICE: Insufficient historical depth for '{mode}' modeling. "
            f"The system cannot yet calibrate your retention corridor. "
            f"Cold-start heuristics are active until your active cycle data is fully mapped."
        )

    elif mode == "day":
        # ── Day view: hourly pattern analysis ─────────────────────
        peak = max(all_time_signals, key=lambda s: s["prob"])
        late_night = [s for s in all_time_signals if int(s["label"]) >= 22 or int(s["label"]) < 5]
        late_night_mins = sum(s["duration"] for s in late_night)
        peak_window = f"{peak['label']}:00"
        total_day_mins = int(sum(s["duration"] for s in all_time_signals))

        analysis_blocks.append(
            f"RETENTION SIGNAL: Your primary engagement corridor is anchored at {peak_window} ({peak['prob']}% probability). "
            f"In a platform ecosystem, this is the 'Golden Hour' where your resistance is lowest and algorithm calibration is most effective."
        )
        analysis_blocks.append(
            f"CHURN RESISTANCE: Across your 24-hour cycle, you provide {total_day_mins} minutes of platform contact. "
            f"The late-night corridor (22:00–05:00) represents {int(late_night_mins)} minutes of 'Dopamine Vulnerability' — "
            f"{'a high-value retention window the platform actively exploits' if late_night_mins > total_day_mins * 0.3 else 'a controlled-exit zone, indicating high sovereign discipline over the algorithm'}."
        )
        diff = int(active_avg_dur) - int(global_avg_dur)
        comparison = "intensifying" if diff > 0 else "decelerating"
        analysis_blocks.append(
            f"NEURAL ENTRENCHMENT: Your current session intensity is {comparison} against your daily baseline by {abs(diff)} minutes. "
            f"This {'increase in daily duration signals successful platform entrenchment' if diff > 0 else 'reduction indicates a sovereignty gain — the algorithm is losing its historical grip on your time'}. "
            f"Current status: {'HIGH RETENTION POTENTIAL' if diff > 5 else 'BEHAVIORAL AUTONOMY DETECTED'}."
        )

    elif mode == "month":
        # ── Month view: 30-day streak and trend analysis ───────────
        active_days = [s for s in all_time_signals if s["prob"] > 0]
        inactive_days = len(all_time_signals) - len(active_days)
        first_half = all_time_signals[:len(all_time_signals)//2]
        second_half = all_time_signals[len(all_time_signals)//2:]
        first_avg = sum(s["duration"] for s in first_half) / max(1, len(first_half))
        second_avg = sum(s["duration"] for s in second_half) / max(1, len(second_half))
        trend = "escalating" if second_avg > first_avg * 1.1 else ("fading" if second_avg < first_avg * 0.9 else "plateauing")
        binge_days = [s for s in all_time_signals if s["binge"] > 20]

        analysis_blocks.append(
            f"SUBSCRIPTION LONGEVITY: Tracing your 30-day behavioral arc reveals a {len(active_days)}/{inactive_days} activity ratio. "
            f"From a platform perspective, your disengagement days are 'Churn Indicators' that the recommendation engine must bridge with high-intensity content drops."
        )
        analysis_blocks.append(
            f"MOMENTUM TRACKING: Your consumption momentum is {trend}. "
            f"Second-half intensity averaged {int(second_avg)} min/day vs {int(first_avg)} in the first half — "
            f"{'a clear entrenchment success' if trend == 'escalating' else 'a withdrawal signal suggesting content fatigue' if trend == 'fading' else 'a habitual plateau that the engine can rely on for consistent metrics'}."
        )
        analysis_blocks.append(
            f"BINGE ARCHITECTURE: {len(binge_days)} days showed elevated binge triggers. "
            f"{'These clusters suggest structural dependency on dopamine-spiking content cycles.' if len(binge_days) > 5 else 'Binge events are sparse, suggesting you are consuming content intentionally rather than reactively.'} "
            f"Monthly Status: {'TARGET FOR RETENTION SPEND' if trend == 'escalating' else 'STABLE HABITUAL ASSET'}."
        )

    else:
        # ── Year view: multi-year evolution analysis ───────────────
        peak_month = max(all_time_signals, key=lambda s: s["prob"])
        trough_month = min(all_time_signals, key=lambda s: s["prob"])
        total_months = len(all_time_signals)
        high_binge_months = [s for s in all_time_signals if s["binge"] > 25]
        
        year_slice = max(1, total_months // (total_months // 12 or 1))
        early = all_time_signals[:year_slice]
        recent = all_time_signals[-year_slice:]
        early_avg = sum(s["duration"] for s in early) / max(1, len(early))
        recent_avg = sum(s["duration"] for s in recent) / max(1, len(recent))
        drift = "deepening" if recent_avg > early_avg * 1.15 else ("retreating" if recent_avg < early_avg * 0.85 else "stable")

        analysis_blocks.append(
            f"LIFETIME VALUE (LTV): Mapping {total_months} months of behavioral evolution. "
            f"Your peak engagement month was {peak_month['label']}, which the system uses as the 'Ideal Profile' to model your future potential. "
            f"Trough activity in {trough_month['label']} indicates your maximum historical resistance."
        )
        analysis_blocks.append(
            f"LONGITUDINAL CAPTURE: Comparing your entry year to your current state, platform capture is {drift}. "
            f"Initial Capture: {int(early_avg)} min/mo → Current Capture: {int(recent_avg)} min/mo. "
            f"{'This deepening trajectory represents a successful multi-year behavioral conditioning project.' if drift == 'deepening' else 'Your retreating trajectory indicates successful behavioral reclamation over time.' if drift == 'retreating' else 'Stable capture suggests the platform has reached its maximum equilibrium in your lifestyle.'}"
        )
        analysis_blocks.append(
            f"STRUCTURAL DEPENDENCY: {len(high_binge_months)} months reached high-intensity binge thresholds. "
            f"{'These are sporadic, suggesting episodic engagement.' if len(high_binge_months) < total_months * 0.2 else 'This frequency indicates structural dependency — the platform is no longer just a tool, but a foundational behavioral pillar.'} "
            f"LTV Status: {'CORE ENTRENCHED ASSET' if drift == 'deepening' else 'MODERATE ENGAGEMENT PROFILE'}."
        )


    full_detailed_summary = " | ".join(analysis_blocks)

    return {
        "action": "Comparative Diagnostic Complete",
        "probability": active_avg_prob / 100,
        "summary": full_detailed_summary,
        "duration": int(active_avg_dur),
        "binge": active_avg_dur > global_avg_dur
    }