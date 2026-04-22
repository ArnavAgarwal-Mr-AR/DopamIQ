from app.features.feature_store import FeatureStore

feature_store = FeatureStore()

def get_manipulation_report(user_id: str):
    features = feature_store.get_latest_features(user_id)
    if not features:
        return None
        
    autoplay_ratio = features.get("autoplay_ratio", 0)
    binge_factor = features.get("binge_factor", 0)
    late_night_ratio = features.get("late_night_ratio", 0)
    completion_rate = features.get("completion_rate", 0)
    
    # 1. Autoplay Vulnerability
    # If autoplay_ratio is high, Netflix successfully hijacks your next session.
    autoplay_impact = "High" if autoplay_ratio > 0.4 else "Moderate" if autoplay_ratio > 0.1 else "Low"
    
    # 2. Attention Retention 
    # Binge factor measures how often they kept you for 3+ episodes
    retention_score = binge_factor * 100
    
    # 3. Decision Fatigue
    # Abandonment rate is a proxy for searching without finding/committing
    abandonment_rate = features.get("abandonment_rate", 0)
    search_fatigue = "Vulnerable" if abandonment_rate > 0.5 else "Resistant"
    
    return {
        "metrics": [
            {
                "id": "autoplay",
                "label": "Autoplay Hijack Rate",
                "value": f"{round(autoplay_ratio * 100)}%",
                "description": f"Netflix has a {autoplay_impact.lower()} success rate in choosing your next content for you.",
                "color": "blue"
            },
            {
                "id": "binge",
                "label": "Retention Gravity",
                "value": f"{round(retention_score)}%",
                "description": "Probability that you will watch 3+ episodes once you start a series.",
                "color": "purple"
            },
            {
                "id": "willpower",
                "label": "Circadian Bypass",
                "value": f"{round(late_night_ratio * 100)}%",
                "description": "Percentage of sessions occurring when biological resistance to UI manipulation is lowest.",
                "color": "red"
            },
            {
                "id": "search",
                "label": "Algorithm Dependency",
                "value": search_fatigue,
                "description": "How often you rely on their recommendations vs finding content yourself.",
                "color": "green"
            }
        ],
        "summary": "Your profile suggests that Netflix's UI hooks are most successful during " + ("late night sessions" if late_night_ratio > 0.3 else "autoplay sequences") + ". They have successfully mapped your cliffhanger tolerance to maximize your retention time."
    }
