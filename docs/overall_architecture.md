# Architecture Specification

## 1. Overview

The Behavioral Scoring Engine (BSE) is a modular system that transforms raw Netflix user data into:

- Behavioral scores  
- Predictive signals  
- User archetypes  
- Natural language insights  

The architecture is designed to be:

- Modular  
- Scalable  
- Interpretable  
- Extensible  

---

## 2. High-Level Architecture
```
            ┌────────────────────────────┐
            │   Netflix Dataset (Raw)    │
            └────────────┬───────────────┘
                         ↓
            ┌────────────────────────────┐
            │   Data Ingestion Layer     │
            └────────────┬───────────────┘
                         ↓
            ┌────────────────────────────┐
            │   Data Processing Layer    │
            │ (Cleaning + Normalization) │
            └────────────┬───────────────┘
                         ↓
            ┌────────────────────────────┐
            │   Sessionization Engine    │
            └────────────┬───────────────┘
                         ↓
            ┌────────────────────────────┐
            │   Feature Engineering      │
            └────────────┬───────────────┘
                         ↓
    ┌────────────────────┼────────────────────┐
    ↓                    ↓                    ↓
┌───────────────┐ ┌────────────────┐ ┌────────────────┐
│ Scoring Engine│ │ Prediction ML  │ │ Meta Metrics   │
│               │ │ Models         │ │ (Drift, etc.)  │
└──────┬────────┘ └──────┬─────────┘ └──────┬─────────┘
       ↓                 ↓                  ↓
      └──────────────┬────────────────────────┘
                     ↓
        ┌────────────────────────────┐
        │ Aggregation Layer          │
        └────────────┬───────────────┘
                     ↓
        ┌────────────────────────────┐
        │ LLM Interpretation Layer   │
        └────────────┬───────────────┘
                     ↓
        ┌────────────────────────────┐
        │ API Layer                  │
        └────────────┬───────────────┘
                     ↓
        ┌────────────────────────────┐
        │ Frontend Dashboard         │
        └────────────────────────────┘

```
---

## 3. Layer-by-Layer Breakdown

---

### 3.1 Data Ingestion Layer

#### Responsibilities:
- Load raw files (CSV/JSON)
- Validate schema
- Handle file uploads

#### Inputs:
- Netflix data export files

#### Outputs:
- Raw structured DataFrames

#### Edge Cases:
- Missing files
- Partial datasets
- Encoding issues

---

### 3.2 Data Processing Layer

#### Responsibilities:
- Clean data
- Normalize timestamps
- Remove invalid entries

#### Key Operations:
- Null handling
- Deduplication
- Time standardization (UTC)

---

### 3.3 Sessionization Engine

#### Responsibilities:
- Convert events → sessions

#### Logic:
- Session gap threshold = 30 minutes
- Merge overlapping events

#### Output:
- Session-level dataset

---

### 3.4 Feature Engineering Layer

#### Responsibilities:
- Convert sessions → features

#### Feature Groups:
- Time features
- Binge features
- Decision features
- Attention features
- Taste features
- Stability features

---

### 3.5 Scoring Engine

#### Responsibilities:
- Compute behavioral scores

#### Outputs:
- Discipline
- Focus
- Curiosity
- Consistency
- Impulsivity

---

### 3.6 Prediction ML Layer

#### Responsibilities:
- Predict user behavior

#### Models:
- Click likelihood
- Abandonment probability
- Session duration
- Binge probability

---

### 3.7 Meta Metrics Layer

#### Responsibilities:
- Compute advanced behavioral metrics

#### Metrics:
- Predictability score
- Behavior drift score
- Susceptibility score

---

### 3.8 Aggregation Layer

#### Responsibilities:
- Combine outputs from all models

#### Output Schema:
```
{
scores: {...},
predictions: {...},
meta_metrics: {...}
}
```

---

### 3.9 LLM Layer

#### Responsibilities:
- Explain outputs
- Generate insights
- Simulate behavior

---

### 3.10 API Layer

#### Responsibilities:
- Serve data to frontend
- Handle requests

---

### 3.11 Frontend Layer

#### Responsibilities:
- Visualize outputs
- Display insights

---

## 4. Data Flow
```
Raw Data → Events → Sessions → Features → Models → Outputs → LLM → UI
```

---

## 5. Storage Design

### Databases:
- PostgreSQL → structured storage
- DuckDB → analytics

### Tables:
- events
- sessions
- features
- scores
- predictions

---

## 6. Scalability Considerations

- Batch processing for large datasets
- Feature caching
- Model inference optimization

---

## 7. Fault Tolerance

- Fallback for missing features
- Default scoring values
- LLM failure fallback

---

## 8. Security

- Data anonymization
- Secure APIs
- Input validation

---

## 9. Deployment Architecture

- Backend → FastAPI (Render / Fly.io)
- Frontend → Vercel
- DB → Supabase / Neon

---

## 10. Summary

This architecture separates:

- Data processing
- Behavioral modeling
- Prediction
- Interpretation

Ensuring modularity and extensibility.

---