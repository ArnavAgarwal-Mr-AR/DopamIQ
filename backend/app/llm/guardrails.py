def validate_input(payload: dict) -> dict:
    """
    Ensure only allowed keys are passed to LLM
    """
    allowed_keys = {"scores", "features", "predictions", "context"}

    return {k: v for k, v in payload.items() if k in allowed_keys}


def enforce_length(text: str, max_length: int = 500) -> str:
    """
    Limit output size
    """
    return text[:max_length]


def remove_speculation(text: str) -> str:
    """
    Basic filtering to reduce hallucinations
    """
    banned_phrases = [
        "maybe",
        "might be",
        "possibly",
        "it seems like"
    ]

    for phrase in banned_phrases:
        text = text.replace(phrase, "")

    return text.strip()


def apply_guardrails(output: str) -> str:
    """
    Full guardrail pipeline
    """
    output = enforce_length(output)
    output = remove_speculation(output)

    return output