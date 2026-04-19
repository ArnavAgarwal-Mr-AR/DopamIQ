import hashlib
import json
import redis
from app.config.settings import settings

try:
    redis_client = redis.from_url(settings.REDIS_URL)
except Exception:
    redis_client = None

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


def simulate(scenario: dict, scores: dict = None):
    # Rule based simulation
    scores = scores or {}
    
    predicted_action = "Unknown"
    confidence = 0.5
    
    time_str = scenario.get("time", "").upper()
    
    # Simple semantic hour checking
    is_late = False
    if "PM" in time_str:
        if any(h in time_str for h in ["10 PM", "11 PM", "12 PM"]):
            is_late = True
    elif "AM" in time_str:
        if any(h in time_str for h in ["1 AM", "2 AM", "3 AM"]):
            is_late = True
            
    if is_late:
        if scores.get("discipline", 0) > 70:
            predicted_action = "Will sleep and close app."
            confidence = 0.85
        else:
            predicted_action = "High Binge Risk. Will click 'Next Episode'."
            confidence = 0.90
    else:
        if scores.get("focus", 0) > 60:
            predicted_action = "Will complete exact session intent and sign off."
            confidence = 0.80
        else:
            predicted_action = "Will casually browse menus without heavy commitment."
            confidence = 0.65
            
    # Deterministic duration mapping based on behavioral weights
    discipline = scores.get("discipline", 50)
    focus = scores.get("focus", 50)
    
    if "Binge" in predicted_action:
        # Higher discipline slightly reduces binge length, lower discipline extends it
        duration = 180 - (discipline / 2) + (100 - focus)
    else:
        # Standard session length influenced by focus
        duration = 20 + (focus / 2)

    return {
        "action": predicted_action,
        "probability": confidence,
        "summary": "Our behavioral engine analyzed your historical profile weights. The prediction indicates that " + predicted_action.lower(),
        "duration": int(duration),
        "binge": "Binge" in predicted_action
    }