from typing import Any, Dict

def validate_not_none(value: Any, name: str):
    if value is None:
        raise ValueError(f"{name} cannot be None")


def validate_range(value: float, min_val: float, max_val: float, name: str):
    if value < min_val or value > max_val:
        raise ValueError(f"{name} must be between {min_val} and {max_val}")


def validate_probability(value: float, name: str = "value"):
    validate_range(value, 0.0, 1.0, name)


def validate_score(value: float, name: str = "score"):
    validate_range(value, 0, 100, name)


def validate_features(features: Dict[str, Any]):
    if not isinstance(features, dict):
        raise ValueError("Features must be a dictionary")

    if not features:
        raise ValueError("Features cannot be empty")


def validate_user_id(user_id: str):
    if not user_id or not isinstance(user_id, str):
        raise ValueError("Invalid user_id")