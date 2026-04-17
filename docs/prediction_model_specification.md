# Prediction Model Specification

## 1. Objective

The Prediction Model is designed to simulate user behavior and answer:

> “What would the user do next in a given context?”

Unlike the scoring engine (which is descriptive), this layer is **predictive and generative**.

---

## 2. Prediction Tasks

The system supports multiple prediction tasks:

### 2.1 Next Action Prediction (Core)
- Predict next action:
  - WATCH
  - SEARCH
  - STOP
  - CONTINUE

---

### 2.2 Next Content Prediction
- Predict next title or content embedding

---

### 2.3 Session Duration Prediction
- Predict how long the user will watch

---

### 2.4 Binge Probability
- Probability that user enters binge mode

---

### 2.5 Decision Simulation (Key Goal)
- Input: hypothetical context  
- Output: predicted user decision  

Example:
```
Input: Friday 11PM, tired state
Output: High probability of binge + low novelty content
```

---

## 3. Modeling Approach

This is a **hybrid sequence modeling system**:

| Component | Role |
|----------|------|
| Feature Model | Current state encoding |
| Sequence Model | Temporal behavior |
| Scoring Model | Behavioral priors |
| Prediction Head | Task-specific outputs |

---

## 4. Input Representation

---

### 4.1 State Vector (Sₜ)

At any time `t`, user state is:

```
Sₜ = [
recent_features,
behavioral_scores,
temporal_context,
session_context
]
```

---

### 4.2 Components

#### A. Recent Features
- last N sessions (N = 5–20)
- recent binge patterns
- recent decision patterns

#### B. Behavioral Scores
- Discipline
- Focus
- Curiosity
- Consistency
- Impulsivity

#### C. Temporal Context
- hour of day
- day of week
- weekend flag

#### D. Session Context
- current session duration
- titles watched so far
- device

---

### 4.3 Final Input Tensor

```
X = [Sₜ₋ₙ, Sₜ₋ₙ₊₁, ..., Sₜ]
```

Sequence length = configurable (default: 10–20)

---

## 5. Model Architecture

### 5.1 Baseline (Recommended MVP)

#### Model Type:
- Gradient Boosting (XGBoost / LightGBM)

#### Input:
- flattened feature vector

#### Output:
- probabilities / regression values

---

### 5.2 Advanced Model (Sequence-Based)

#### Model Type:
- LSTM / GRU / Transformer

---

### 5.3 Architecture Diagram

```
Input Sequence (Sₜ₋ₙ → Sₜ)
↓
Sequence Encoder (LSTM / Transformer)
↓
Hidden Representation (Hₜ)
↓
Prediction Heads:
├── Action Head (Softmax)
├── Duration Head (Regression)
├── Binge Head (Sigmoid)
```

---

### 5.4 Multi-Head Output

```
Y = {
action_probs,
expected_duration,
binge_probability
}
```

---

## 6. Feature Engineering for Prediction

---

### 6.1 Temporal Features
- sin/cos encoding of time
- weekday encoding

---

### 6.2 Behavioral Momentum
- rolling averages of scores
- recent trend slopes

---

### 6.3 Sequence Features
- last K actions
- last K genres
- session progression

---

### 6.4 Contextual Features
- device type
- session length so far

---

## 7. Training Strategy

---

### 7.1 Dataset Construction

Each training sample:

```
Input: Sₜ₋ₙ → Sₜ
Target: actionₜ₊₁, durationₜ₊₁, bingeₜ₊₁
```

---

### 7.2 Label Generation

Derived from logs:

- next action → next event type
- duration → next session duration
- binge → threshold-based labeling

---

### 7.3 Train/Test Split

- time-based split (NOT random)
- train on past → test on future

---

### 7.4 Loss Functions

| Task | Loss |
|------|------|
| Action | Cross-Entropy |
| Duration | MSE |
| Binge | Binary Cross-Entropy |

---

## 8. Evaluation Metrics

---

### 8.1 Classification
- Accuracy
- F1 Score
- ROC-AUC

---

### 8.2 Regression
- RMSE
- MAE

---

### 8.3 Sequence Evaluation
- next-step accuracy
- sequence consistency

---

## 9. Inference Pipeline

```
Current User State
↓
Feature Extraction
↓
Sequence Encoding
↓
Prediction Model
↓
Output Predictions
```

---

## 10. Decision Simulation Engine


### 10.1 Purpose

Simulate user behavior under hypothetical conditions.

---

### 10.2 Input

```
{
time: "Friday 23:00",
device: "mobile",
current_state: {...}
}
```

---

### 10.3 Output

```
{
action: WATCH,
probability: 0.82,
duration: 90 mins,
binge: true
}
```

---

### 10.4 Use Cases
- "What will I do tonight?"
- "Will I binge if I start watching now?"

---

## 11. Personalization

Model is trained **per user** (not global).

Optional:
- pretrain on generic data
- fine-tune per user

---

## 12. Limitations

---

### 12.1 Data Limitations
- sparse sequences
- missing context

---

### 12.2 Modeling Limitations
- cannot capture external events
- limited generalization

---

### 12.3 Behavioral Limitations
- human behavior is stochastic
- predictions are probabilistic

---

## 13. Failure Modes

- overfitting to recent behavior
- concept drift
- unstable predictions

---

## 14. Improvements

- reinforcement learning
- hierarchical models
- multimodal inputs

---

## 15. Summary

The Prediction Model:

- models user behavior as a sequence
- encodes current state + history
- predicts future actions and outcomes
- enables simulation of user decisions

This transforms the system from:
- descriptive → predictive  
- static → dynamic  
- analytics → behavioral AI  