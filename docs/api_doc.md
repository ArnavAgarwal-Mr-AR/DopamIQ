# API Specification

## 1. Overview

The API layer exposes all system outputs to clients.

## 2. Base URL
```
/api
```

## 3. Endpoints


### 3.1 Upload Data

```
POST /upload
```

#### Input:
- files (CSV/JSON)

#### Output:
```
{ "status": "success" }
```

---

### 3.2 Get Scores
```
GET /scores
```

#### Response:
```
{
discipline: number,
focus: number,
curiosity: number,
consistency: number,
impulsivity: number
}
```

---

### 3.3 Get Predictions

```
GET /predictions
```

#### Response:
```
{
click_probability: number,
abandonment_probability: number,
binge_probability: number,
expected_duration: number
}
```
---

### 3.4 Get Meta Metrics

```
GET /meta
```

#### Response:
```
{
predictability: number,
drift: number,
susceptibility: number
}
```

---

### 3.5 Get Insights (LLM)

```
POST /llm/explain
```

#### Input:
```
{
scores: {...},
predictions: {...}
}
```

#### Output:
```
{
explanation: string
}
```

---


### 3.6 Simulation

```
POST /llm/simulate
```

#### Input:
```
{
scenario: {...}
}
```

#### Output:
```
{
predicted_behavior: {...}
}
```

---

## 4. Error Handling

- 400 → invalid input
- 500 → server error

---

## 5. Performance

- caching enabled
- async processing

---

## 6. Security

- authentication (JWT optional)
- rate limiting

---

## 7. Summary

The API layer provides:
- structured access to all outputs
- separation between ML and UI
- scalability for future extensions

---