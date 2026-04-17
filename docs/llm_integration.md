# LLM Integration Specification

## 1. Overview

This document defines how Large Language Models (LLMs) are integrated into the Behavioral Scoring Engine (BSE).

The LLM is **not used for core prediction or scoring**. Instead, it acts as:

- Interpretation layer  
- Explanation engine  
- Simulation interface  
- User interaction layer  

---

## 2. Design Philosophy

### 2.1 Core Principle

Separate responsibilities:

| Component | Role |
|----------|------|
| ML Models | Numerical truth (scores, probabilities) |
| LLM | Interpretation, reasoning, language |

---

### 2.2 Why Not Use LLM for Prediction?

LLMs:
- Are non-deterministic  
- Do not learn from user-specific data directly  
- Lack temporal modeling fidelity  
- Cannot guarantee numerical accuracy  

Therefore:
> LLM outputs must never replace model outputs.

---

## 3. LLM Responsibilities

---

### 3.1 Explanation Engine

Convert structured outputs into natural language explanations.

#### Input:
```
{
discipline: 42,
impulsivity: 71,
late_night_ratio: 0.68,
binge_sessions: 5
}
```
id="llm_exp_in"

#### Output:

```
"You tend to lose control during late-night sessions, often continuing beyond intended limits."
```
id="llm_exp_out"

---

### 3.2 Insight Generation

Generate concise behavioral insights.

Examples:
- "Your focus drops significantly after 10 PM"
- "You explore more content on weekends"

---

### 3.3 What-if Simulation

Simulate user behavior under hypothetical conditions.

#### Input:

```
{
scenario: "Friday 11 PM, mobile device",
current_scores: {...}
}
```
id="llm_sim_in"

#### Output:

```
"You are likely to start a session and continue for a prolonged period, favoring familiar content."
```
id="llm_sim_out"

---

### 3.4 Report Generation

Generate periodic summaries:

- Daily summaries  
- Weekly reports  
- Behavioral change reports  

---

### 3.5 Explanation of Predictions

Explain model outputs:

#### Input:

```
{
binge_probability: 0.82,
features: {
session_length: 90,
late_night: true
}
}
```
id="llm_pred_in"

#### Output:

```
"The high binge probability is driven by extended session length and late-night usage patterns."
```
id="llm_pred_out"

---

## 4. Input to LLM

LLMs should **never receive raw logs**.

---

### 4.1 Allowed Inputs

- Aggregated features  
- Scores  
- Model outputs  
- Contextual metadata  

---

### 4.2 Input Schema

```
{
scores: {...},
features: {...},
predictions: {...},
context: {...}
}
```
id="llm_input_schema"

---

### 4.3 Input Constraints

- Must be structured  
- Must be bounded in size  
- Must avoid redundancy  

---

## 5. Prompt Design

---

### 5.1 Prompt Structure

Each prompt must contain:

1. Role definition  
2. Input data  
3. Output format specification  
4. Constraints  

---

### 5.2 Example Prompt (Explanation)

```
You are a behavioral analyst.

Given the following user metrics:

* Discipline: 42
* Impulsivity: 71
* Late-night usage: high

Explain the user's behavior in 2–3 sentences.

Be concise and avoid speculation beyond the data.
```
id="prompt_explanation"

---

### 5.3 Example Prompt (Structured Output)

```
Given:

* Click probability: 0.76
* Abandonment probability: 0.64

Return JSON:
{
"summary": "...",
"reasoning": "..."
}
```
id="prompt_json"

---

### 5.4 Prompt Guidelines

- Avoid open-ended prompts  
- Enforce structure (JSON preferred)  
- Limit output length  
- Prevent hallucination via constraints  

---

## 6. Output Handling

### 6.1 Output Types

- Plain text explanations  
- Structured JSON  
- Bullet-point insights  

---

### 6.2 Validation

- Ensure JSON validity (if required)  
- Enforce schema  
- Reject malformed outputs  

---

### 6.3 Post-processing

- Trim verbosity  
- Standardize tone  
- Remove unsupported claims  

---

## 7. LLM Pipeline Integration


### 7.1 Flow

```
ML Models → Structured Outputs
↓
LLM Input Formatter
↓
LLM Inference
↓
Output Validator
↓
Frontend

```
id="llm_flow"

---

### 7.2 API Layer

```
POST /llm/explain
POST /llm/simulate
POST /llm/report
```
id="llm_api"

---

## 8. Personalization Strategy

### 8.1 Static Personalization
- Use user scores as context

---

### 8.2 Dynamic Personalization
- Include recent behavior trends

---

### 8.3 Prompt Conditioning

Inject user-specific variables into prompt:

```
User Profile:

* High curiosity
* Moderate discipline

```
id="prompt_context"

---

## 9. Limitations


### 9.1 Hallucination Risk
LLM may:
- infer unsupported causes  
- exaggerate patterns  

---

### 9.2 Inconsistency
- same input may yield slightly different outputs  

---

### 9.3 Lack of Ground Truth
- explanations are interpretive, not factual  

---

## 10. Guardrails


### 10.1 Strict Grounding

- Only allow reasoning based on provided inputs  
- Explicitly prohibit assumptions  

---

### 10.2 Output Constraints

- max length  
- structured format  

---

### 10.3 Fallback Mechanism

- if LLM fails → return template-based output  

---

## 11. Evaluation

### 11.1 Metrics

- Consistency across runs  
- Relevance of explanations  
- User interpretability  

---

### 11.2 Human Evaluation

- clarity  
- usefulness  
- correctness  

---

## 12. Model Choices

### 12.1 Recommended Models

- GPT-style models (for reasoning + language)
- Smaller local models (for cost efficiency)

---

### 12.2 Trade-offs

| Model Type | Pros | Cons |
|-----------|------|------|
| Large LLM | better reasoning | expensive |
| Small LLM | fast, cheap | weaker output |

---

## 13. Security & Privacy


### 13.1 Data Handling
- Do not send PII to LLM  
- anonymize inputs  

---

### 13.2 Prompt Injection Risks
- sanitize inputs  
- avoid user-controlled prompts  

---

## 14. Future Extensions

- Fine-tuned LLM on behavioral data  
- Memory-based personalization  
- Multi-modal inputs  

---

## 15. Summary

The LLM layer:

- interprets structured outputs  
- generates insights and explanations  
- enables simulation and interaction  

It is:
- supportive, not authoritative  
- flexible, but constrained  
- essential for UX, not for core modeling  

---