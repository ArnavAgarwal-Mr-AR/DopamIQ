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
    # Rule-based simulation with Comparative Forensics
    scores = scores or {}
    view_mode = scenario.get("mode", mode)
    time_str = scenario.get("time", "").upper()
    device = scenario.get("device", "all").upper()
    
    # ── Behavioral Signal Extraction ─────────────────────────────
    all_time_signals = get_behavioral_signals(user_id, view=view_mode)
    
    # Defaults
    active_avg_prob = 50.0
    active_avg_dur = 15.0
    global_avg_dur = 25.0
    confidence_score = 100 # Default to high confidence
    
    if all_time_signals:
        global_avg_dur = sum(s["duration"] for s in all_time_signals) / len(all_time_signals)
        
        if view_mode == 'day':
            # Extract Day and Hour from "FRIDAY 1 AM"
            parts = time_str.split()
            day_of_week = parts[0] if len(parts) > 0 else "ANY"
            hour_part = parts[1] if len(parts) > 1 else "12"
            meridiem = parts[2] if len(parts) > 2 else "PM"
            
            try:
                hour_val = int(hour_part)
                if meridiem == "PM" and hour_val != 12: hour_val += 12
                if meridiem == "AM" and hour_val == 12: hour_val = 0
                
                # Find the signal for this specific hour
                sig = next((s for s in all_time_signals if s['label'] == f"{hour_val:02d}"), None)
                if sig:
                    active_avg_prob = sig['prob']
                    active_avg_dur = sig['duration']
                    
                    # Apply Day Variance
                    is_weekend = day_of_week in ["FRIDAY", "SATURDAY", "SUNDAY"]
                    if is_weekend:
                        active_avg_prob = min(100, active_avg_prob * 1.15)
                        active_avg_dur *= 1.2
                    
                    # ── Device Verification ──
                    # If user has no Smart TV sessions, lower confidence and use heuristic
                    if "TV" in device:
                        confidence_score = 65 # Heuristic-based
                        active_avg_dur *= 1.4 # Platforms maximize TV sessions
                    elif "MOBILE" in device:
                        active_avg_dur *= 0.8
            except:
                pass

    # ── Comparative Forensic Analysis ────────────────────────────
    analysis_blocks = []
    is_late = any(h in time_str for h in ["10 PM", "11 PM", "12 PM", "1 AM", "2 AM", "3 AM"])
    
    if not all_time_signals or all(s["prob"] == 0 for s in all_time_signals):
        analysis_blocks.append(
            f"SYSTEM COLD-START: No historical depth for '{view_mode}' modeling. Predictions are currently running on uncalibrated platform defaults."
        )
    else:
        diff = int(active_avg_dur) - int(global_avg_dur)
        comparison = "intensifying" if diff > 0 else "decelerating"
        
        # Identity-Aware Summary
        if confidence_score < 80:
            analysis_blocks.append(
                f"HEURISTIC WARNING: No historical signature detected for '{device}'. Prediction is scaled using global platform heuristics (+40% duration for TV contexts)."
            )
        
        analysis_blocks.append(
            f"TEMPORAL ALIGNMENT: Based on your {day_of_week} history, the system anticipates a {int(active_avg_prob)}% probability of engagement at this hour."
        )
        analysis_blocks.append(
            f"NEURAL CAPTURE: Expected intensity is {int(active_avg_dur)} mins—a {abs(diff)}m {comparison} from your lifetime baseline."
        )

    full_detailed_summary = " | ".join(analysis_blocks)

    # ── Algorithm Exploitation Strategy (The "Netflix Lens") ────────
    if is_late and active_avg_dur > global_avg_dur:
        predicted_action = "HIGH-INTENSITY LATE-NIGHT BINGE"
        strategy = "EXPLOIT DECISION FATIGUE: Implement zero-countdown auto-play. Pivot thumbnails to 'Comfort' categories to reduce exit friction."
    elif active_avg_dur > global_avg_dur * 1.2:
        predicted_action = "ESCALATED ENGAGEMENT"
        strategy = "MAXIMIZE RETENTION LOOP: Inject cliffhanger-dense episodic content. Suppress 'Skip Intro' to increase session depth."
    elif active_avg_dur < global_avg_dur * 0.8:
        predicted_action = "CONTROLLED CONSUMPTION"
        strategy = "MAINTAIN PASSIVE DISCOVERY: User showing high resistance. Algorithm shifts to background maintenance."
    else:
        predicted_action = "STABLE HABITUAL SESSION"
        strategy = "PRE-FETCH BUFFERING: Stable pattern detected. Pre-load 4K video chunks to local ISP cache for instant-start gratification."

    return {
        "action": predicted_action,
        "probability": int(active_avg_prob),
        "duration": int(active_avg_dur),
        "binge": active_avg_dur > global_avg_dur,
        "strategy": strategy,
        "summary": full_detailed_summary,
        "confidence": confidence_score
    }

