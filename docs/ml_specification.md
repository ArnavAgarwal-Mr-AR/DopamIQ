## Model & Machine Learning Specification


## 1. Overview

This document defines the complete modeling layer of the Behavioral Scoring Engine (BSE). It covers:

- Input data structures
- Feature engineering
- Mathematical scoring models
- Archetype classification
- Prediction models
- Evaluation strategies
- Limitations and assumptions

This is the **core intelligence layer** of the system.

---

## 2. Modeling Philosophy

### 2.1 Objective
Transform passive behavioral logs into:
- Quantitative scores
- Interpretable behavioral traits
- Predictive signals

### 2.2 Constraints
- No direct labels (unsupervised / weak supervision)
- No ground truth personality data
- Must remain interpretable

### 2.3 Key Principle
All outputs must be:
- Deterministic (same input → same output)
- Explainable (traceable to features)
- Stable (low variance across time)

---

## 3. Input Data Specification

### 3.1 Raw Inputs

From Netflix dataset:

#### ViewingActivity
- timestamp
- duration
- title
- device
- country

#### PlaybackRelatedEvents
- pause events
- rewind events
- seek events

#### SearchHistory
- query
- timestamp
- action (play, view, add)

#### Ratings
- thumbs / stars
- timestamp

#### Clickstream
- navigation path
- timestamps

---

### 3.2 Unified Event Schema

All inputs must be converted into:

```
{
event_id: string,
timestamp: datetime,
event_type: enum [WATCH, SEARCH, CLICK, RATE],
title: string,
duration: float,
device: string,
metadata: dict
}
```

---

## 4. Session Modeling

### 4.1 Session Definition
A session is a continuous interaction window.

### 4.2 Rules
- New session if gap > 30 minutes
- Merge overlapping events

### 4.3 Session Output

```
{
session_id,
start_time,
end_time,
total_duration,
num_titles,
binge_flag,
device_switch_flag
}
```

---

## 5. Feature Engineering

All features must be normalized to [0, 1].

---

### 5.1 Time-Based Features

| Feature | Description |
|--------|-------------|
| avg_session_duration | Mean duration per session |
| late_night_ratio | % usage between 23:00–03:00 |
| weekend_ratio | % usage on weekends |

---

### 5.2 Binge Features

| Feature | Description |
|--------|-------------|
| avg_titles_per_session | Mean titles per session |
| max_binge_length | Maximum titles in one session |
| autoplay_ratio | % autoplay-driven sessions |

---

### 5.3 Decision Features

| Feature | Description |
|--------|-------------|
| search_to_play_ratio | searches / plays |
| avg_decision_time | time between search and play |
| abandonment_rate | started but not completed |

---

### 5.4 Attention Features

| Feature | Description |
|--------|-------------|
| completion_rate | % content completed |
| pause_frequency | pauses per session |
| rewind_ratio | rewinds per session |

---

### 5.5 Taste Features

| Feature | Description |
|--------|-------------|
| genre_entropy | diversity of genres |
| rewatch_ratio | repeated content |
| novelty_score | new vs old content |

---

### 5.6 Stability Features

| Feature | Description |
|--------|-------------|
| variance_usage | variability in usage |
| weekly_drift | change over time |
| consistency_index | inverse variance |

---

## 6. Feature Normalization

### 6.1 Methods
- Min-Max Scaling
- Percentile Scaling (recommended)

### 6.2 Edge Cases
- Zero variance → assign neutral value
- Outliers → clip at 95th percentile

---

## 7. Scoring Models

All scores are scaled to [0, 100].

---

### 7.1 Discipline Score

Measures behavioral control.

```
D = 100
- w1 * binge_length
- w2 * late_night_ratio
- w3 * autoplay_ratio
```

Interpretation:
- High → controlled usage
- Low → reactive consumption

---

### 7.2 Focus Score

Measures attention stability.

```
F = w1 * completion_rate
- w2 * pause_frequency
- w3 * abandonment_rate
```

---

### 7.3 Curiosity Score

Measures exploration behavior.

```
C = w1 * genre_entropy
+ w2 * novelty_score
+ w3 * search_activity
```

---

### 7.4 Consistency Score

Measures behavioral stability.

```
S = 100 - variance_usage
```

---

### 7.5 Impulsivity Score

Measures reactive behavior.

```
I = w1 * autoplay_ratio
+ w2 * inverse_decision_time
+ w3 * binge_sessions
```

---

## 8. Weight Calibration

### 8.1 Initial Strategy
- Equal weights

### 8.2 Advanced Strategy
- Grid search
- Percentile-based weighting

### 8.3 Constraints
- Sum of weights = 1
- Avoid dominance of single feature

---

## 9. Archetype Classification

---

### 9.1 Rule-Based Model

```
if Curiosity > 70 and Impulsivity > 60:
"Curious Binger"

if Discipline > 70 and Focus > 70:
"Intentional Optimizer"
```

---

### 9.2 Clustering Model

#### Input:
- [D, F, C, S, I]

#### Algorithm:
- K-Means (k=4–6)
- GMM (optional)

#### Output:
- Cluster label
- Archetype mapping

---

### 9.3 Evaluation
- Silhouette score
- Stability across runs

---

## 10. Prediction Models

---

### 10.1 Binge Prediction

#### Model:
- Logistic Regression

#### Input:
- recent sessions
- recent scores

#### Output:
```
P(binge_next_session)
```

---

### 10.2 Session Duration Prediction

#### Model:
- Linear Regression / XGBoost

#### Output:
```
expected_duration_minutes
```

---

## 11. Insight Generation

Rule-based system.

### Examples:
- late_night_ratio > threshold → "Late-night usage is high"
- high abandonment → "Low engagement detected"

---

## 12. Evaluation Metrics

### 12.1 Internal Metrics
- score stability (variance over time)
- feature consistency

### 12.2 Predictive Metrics
- accuracy (classification)
- RMSE (regression)

---

## 13. Limitations

### 13.1 Data Limitations
- No ground truth personality labels
- Missing or incomplete logs
- Limited context (only Netflix)

---

### 13.2 Modeling Limitations
- Proxy-based inference (not direct)
- Sensitive to feature engineering
- cannot capture real emotions

---

### 13.3 Behavioral Limitations
- External factors not captured:
  - work stress
  - social interactions
  - life events

---

## 14. Bias & Risks

- Overfitting to small datasets
- Misinterpretation of scores
- cultural bias in content

---

## 15. Extensions

- Multi-platform integration
- temporal deep learning (LSTM)
- reinforcement learning

---

## 16. Final Summary

This model transforms behavioral logs into:
- structured features
- interpretable scores
- predictive signals

It is:
- modular
- extensible
- explainable