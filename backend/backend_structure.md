# Backend Structure Documentation

## 1. Overview

This backend implements the Behavioral Scoring Engine (BSE), transforming raw user activity data into:

* Behavioral scores
* Predictions
* Meta metrics
* LLM-generated insights

The system follows a **pipeline-first + service-oriented architecture**, ensuring:

* clear separation of concerns
* deterministic modeling
* scalable serving

---

## 2. Core Design Principles

### 2.1 Separation of Concerns

* Pipelines → data transformation
* Features → structured behavioral representation
* Scoring → deterministic computation
* Prediction → probabilistic modeling
* Services → orchestration layer
* API → interface layer

---

### 2.2 Deterministic + Probabilistic Hybrid

* Scoring → deterministic (explainable)
* Prediction → probabilistic (behavior simulation)
* LLM → interpretative (non-authoritative)

---

### 2.3 Feature-Centric Design

> Features are the core contract between:

* pipeline
* scoring
* prediction
* meta metrics

---

## 3. Folder Breakdown (Updated)

---

### `/app/main.py`

* FastAPI entrypoint
* route registration
* lifecycle management
* logging initialization

---

### `/config`

* `settings.py` → env-driven config
* `logging.py` → structured logging

---

### `/api`

Handles HTTP layer only.

#### `/routes`

* upload → triggers pipeline
* scores → returns computed scores
* predictions → returns inference outputs
* meta → returns behavioral metrics
* llm → explanation + simulation

#### `dependencies.py`

* DB session injection
* user context (placeholder)

---

### `/schemas`

Defines strict API contracts.

Ensures:

* validation
* consistency
* frontend-backend stability

---

### `/pipelines`

Implements raw data transformation:

* ingestion → load data
* processing → clean + normalize
* sessionization → group events
* pipeline_runner → orchestrates entire flow

---

### `/features`

#### `feature_builder.py`

* transforms sessions → behavioral features

#### `feature_normalizer.py`

* scales features to [0,1]

#### `feature_store.py`

**CRITICAL COMPONENT**

Responsibilities:

* store features in Postgres
* cache features in Redis
* serve latest features for inference

---

### `/scoring`

* deterministic score computation
* weight-driven system

Outputs:

* Discipline
* Focus
* Curiosity
* Consistency
* Impulsivity

---

### `/prediction`

#### `/models`

* click
* binge
* abandonment
* duration

#### `predictor.py`

* unified inference interface

#### `trainer.py`

* offline training (future extension)

---

### `/meta`

Advanced behavioral metrics:

* predictability
* drift
* susceptibility

---

### `/llm`

LLM integration layer (non-core logic):

* prompt_builder → structured prompts
* llm_client → API calls
* output_parser → validation
* guardrails → safety + constraints

---

### `/services` (🔥 MOST IMPORTANT LAYER)

This is the **execution brain** of the system.

#### Responsibilities:

* orchestrate full flow
* connect feature store + models
* isolate business logic from API

#### Example Flow:

```
API → Service → Feature Store → Models → Response
```

---

### `/db`

#### PostgreSQL

* structured storage
* features
* scores
* predictions

#### DuckDB

* analytics + experimentation

#### Redis

* caching layer (features + inference)

---

### `/utils`

Reusable utilities:

* time handling
* validation
* constants

---

### `/data`

Local storage:

* raw → uploaded files
* processed → cleaned data
* features → offline storage

---

### `/scripts`

Dev + batch execution:

* run_pipeline.py → manual pipeline trigger
* seed_data.py → test data generation
* train_models.py → offline training

---

### `/tests`

* unit tests
* API tests
* pipeline validation

---

## 4. Real Data Flow (Updated)

### 🔄 Pipeline Flow

```
Raw Data → Events → Sessions → Features → Normalize → Store
```

---

### ⚡ Inference Flow

```
API Request
↓
Service Layer
↓
Redis (cache hit?)
↓
Postgres (fallback)
↓
Scoring + Prediction
↓
Return Response
```

---

### 🤖 LLM Flow

```
Scores + Predictions
↓
Prompt Builder
↓
LLM Client
↓
Guardrails
↓
Parsed Output
```

---

## 5. Feature Store Behavior

Feature store acts as:

> The single source of truth for all inference

### Layers:

* Postgres → persistent storage
* Redis → fast access

---

## 6. Execution Model

### Synchronous:

* API calls
* scoring
* prediction

### Async (future):

* pipeline execution
* model training

---

## 7. Summary

This backend is:

* modular
* feature-driven
* service-oriented
* production-ready

It separates:

* data processing
* behavioral modeling
* inference
* interpretation

while ensuring:

* scalability
* interpretability
* maintainability
