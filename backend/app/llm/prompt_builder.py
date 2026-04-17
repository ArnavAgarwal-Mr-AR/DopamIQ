def build_explanation_prompt(scores: dict, features: dict = None):
    """
    Build prompt for explanation
    """

    prompt = f"""
You are a behavioral analyst.

Given the following user scores:

Discipline: {scores.get('discipline')}
Focus: {scores.get('focus')}
Curiosity: {scores.get('curiosity')}
Consistency: {scores.get('consistency')}
Impulsivity: {scores.get('impulsivity')}

Explain the user's behavior in 2-3 sentences.
Be concise and only use the provided data.
"""

    if features:
        prompt += "\nAdditional Features:\n"
        for k, v in features.items():
            prompt += f"{k}: {v}\n"

    return prompt.strip()


def build_simulation_prompt(scenario: dict, scores: dict = None):
    """
    Build prompt for simulation
    """

    prompt = f"""
You are a behavioral prediction system.

Given the following scenario:

{scenario}

"""

    if scores:
        prompt += "\nUser Profile:\n"
        for k, v in scores.items():
            prompt += f"{k}: {v}\n"

    prompt += """
Predict:
- next action
- probability
- expected duration
- binge likelihood

Return JSON format.
"""

    return prompt.strip()