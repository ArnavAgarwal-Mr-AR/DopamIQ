from app.llm.prompt_builder import build_explanation_prompt, build_simulation_prompt
from app.llm.llm_client import LLMClient
from app.llm.output_parser import parse_explanation, parse_simulation
from app.llm.guardrails import apply_guardrails, validate_input

llm_client = LLMClient()


def explain(scores: dict, predictions: dict):
    payload = validate_input({
        "scores": scores,
        "predictions": predictions
    })

    prompt = build_explanation_prompt(payload["scores"])

    raw_output = llm_client.generate(prompt)

    safe_output = apply_guardrails(raw_output)

    return parse_explanation(safe_output)


def simulate(scenario: dict, scores: dict = None):
    payload = validate_input({
        "context": scenario,
        "scores": scores or {}
    })

    prompt = build_simulation_prompt(payload["context"], payload["scores"])

    raw_output = llm_client.generate(prompt)

    safe_output = apply_guardrails(raw_output)

    return parse_simulation(safe_output)