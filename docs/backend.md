# Backend Specification
## Behavioral Scoring Engine (BSE)

---

## 1. Overview

The backend is responsible for:

- Data ingestion and processing  
- Feature engineering  
- Scoring and prediction  
- Meta-metric computation  
- LLM orchestration  
- API serving  

It acts as the **core computation engine** of the system.

---

## 2. Tech Stack

### Core
- Python 3.10+
- FastAPI (API layer)
- Uvicorn (ASGI server)

### Data Processing
- Pandas (initial)
- Polars (optimized)
- NumPy

### ML
- Scikit-learn
- XGBoost / LightGBM

### Storage
- PostgreSQL (primary DB)
- DuckDB (analytics queries)
- Redis (caching)

### LLM Integration
- OpenAI / local LLM (optional)
- HTTP client (requests / httpx)

---

## 3. Project Structure
```
backend/
├── app/
│ ├── main.py
│ ├── config/
│ ├── api/
│ ├── services/
│ ├── models/
│ ├── pipelines/
│ ├── utils/
│ └── schemas/
├── data/
├── tests/
└── requirements.txt
```

---

## 4. Core Modules

---

### 4.1 API Layer (`/api`)

Handles HTTP requests.

#### Responsibilities:
- Route handling
- Request validation
- Response formatting

---

### 4.2 Data Pipeline (`/pipelines`)

#### Responsibilities:
- Ingestion
- Cleaning
- Normalization
- Sessionization

---

### 4.3 Feature Service (`/services/feature_service.py`)

#### Responsibilities:
- Generate features from sessions
- Normalize features

---

### 4.4 Scoring Service (`/services/scoring_service.py`)

#### Responsibilities:
- Compute behavioral scores

---

### 4.5 Prediction Service (`/services/prediction_service.py`)

#### Responsibilities:
- Run ML models
- Generate predictions:
  - Click probability
  - Abandonment probability
  - Binge probability

---

### 4.6 Meta Metrics Service (`/services/meta_service.py`)

#### Responsibilities:
- Compute:
  - Predictability
  - Drift
  - Susceptibility

---

### 4.7 LLM Service (`/services/llm_service.py`)

#### Responsibilities:
- Format prompts
- Call LLM APIs
- Validate outputs

---

## 5. Data Flow
```
Upload Data
↓
Parse → Clean → Normalize
↓
Sessionization
↓
Feature Generation
↓
Scoring + Prediction
↓
Meta Metrics
↓
LLM (optional)
↓
API Response
```

---

## 6. Database Design

---

### 6.1 Tables

#### events
- event_id
- timestamp
- event_type
- title
- device

#### sessions
- session_id
- start_time
- end_time
- duration

#### features
- feature_id
- user_id
- values (JSON)

#### scores
- user_id
- discipline
- focus
- curiosity
- consistency
- impulsivity

#### predictions
- click_prob
- abandonment_prob
- binge_prob

---

## 7. API Implementation

---

### 7.1 Example (FastAPI)

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/scores")
def get_scores():
    return {"discipline": 70}
```

## 8. Caching Strategy
Redis for:
- scores
- predictions
- Cache invalidation on new data upload

## 9. Asynchronous Processing
Background tasks for:
- feature generation
- model inference

## 10. Error Handling
- Input validation errors
- Missing data fallback
- Model failure fallback

## 11. Security
- Input sanitization
- Rate limiting
- JWT authentication (optional)

## 12. Performance Optimization
- Use Polars for large datasets
- Batch processing
- Precompute features

## 13. Testing
- Unit tests (services)
- Integration tests (API)

## 14. Deployment
- Do not use docker
- Hosted on Render / Fly.io

## 15. Summary

Backend handles:
- data → features → predictions → API

with modular, scalable architecture.
