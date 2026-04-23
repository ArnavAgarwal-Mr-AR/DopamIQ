import hashlib
import json
from app.config.settings import settings

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
    
    # Advanced Comparative Synthesis
    analysis_blocks = []
    
    if mode == "day":
        reason = "ANALYSIS REASON: Cross-referencing current 24-hour cycle against all-time daily resistance baselines."
        
        # Block 1: Full Day Analysis
        analysis_blocks.append(f"{reason} | Over a full 24-hour day, the system projects a total cognitive commitment of {int(sum(s['duration'] for s in all_time_signals[:24]) if all_time_signals else 0)} forensic minutes.")
        
        # Block 2: Comparison to Average Day
        diff = int(active_avg_dur) - int(global_avg_dur)
        comparison = "surpassing" if diff > 0 else "optimizing below"
        analysis_blocks.append(f"ALGORITHMIC GRIP: Current daily intensity is {comparison} your general baseline by {abs(diff)}m. This indicates a {('retention drift' if diff > 0 else 'sovereignty gain')} in your daily routine.")
        
    else:
        reason = "ANALYSIS REASON: Long-term month-over-month habit synthesis vs. multi-year behavioral averages."
        
        # Block 1: Full Month Analysis
        total_monthly_volume = sum(s["duration"] for s in all_time_signals) if all_time_signals else 0
        analysis_blocks.append(f"{reason} | This active monthly cycle represents a total dataset of {len(all_time_signals)} recording days, totaling {int(total_monthly_volume)} minutes of platform interaction.")
        
        # Block 2: Comparison to General Month Average
        diff_pct = int(((active_avg_dur / global_avg_dur) - 1) * 100) if global_avg_dur > 0 else 0
        comparison = "intensifying by" if diff_pct > 0 else "reducing by"
        analysis_blocks.append(f"ALGORITHMIC GRIP: Your average daily duration this month ({int(active_avg_dur)}m) is {comparison} {abs(diff_pct)}% compared to your all-time monthly average of {int(global_avg_dur)}m.")

    # Block 3: Final Diagnostic
    status = "RETENTION LOOP DETECTED" if active_avg_dur > global_avg_dur else "BEHAVIORAL STABILITY MAINTAINED"
    analysis_blocks.append(f"NEURAL COST: Your current {mode} trajectory suggests a {('high' if active_avg_prob > 50 else 'stable')} entropy state. Overall system status: {status}.")

    full_detailed_summary = " | ".join(analysis_blocks)

    return {
        "action": "Comparative Diagnostic Complete",
        "probability": active_avg_prob / 100,
        "summary": full_detailed_summary,
        "duration": int(active_avg_dur),
        "binge": active_avg_dur > global_avg_dur
    }