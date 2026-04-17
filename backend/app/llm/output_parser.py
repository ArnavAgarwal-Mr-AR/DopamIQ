import json

def parse_json_output(text: str):
    """
    Try to parse JSON output from LLM.
    Fallback to raw text if parsing fails.
    """
    try:
        return json.loads(text)
    except Exception:
        return {"raw_output": text}


def parse_explanation(text: str) -> str:
    """
    Clean explanation output.
    """
    return text.strip()


def parse_simulation(text: str):
    """
    Expect structured JSON for simulation.
    """
    parsed = parse_json_output(text)

    if isinstance(parsed, dict):
        return parsed

    return {"predicted_behavior": text}