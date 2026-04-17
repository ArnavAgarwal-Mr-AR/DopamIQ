# Prediction Model Extensions

This document extends the Prediction Model with additional behavioral prediction capabilities:

1. Click Likelihood & Abandonment Probability  
2. Predictability Score  
3. Behavior Drift Score  
4. Susceptibility Score  

---

# 1. Click Likelihood & Abandonment Probability

## 1.1 Objective

Predict:
- **Click Likelihood** → probability user clicks a given content item  
- **Abandonment Probability** → probability user stops watching before completion  

---

## 1.2 Input Requirements

### A. User State Features

From scoring + recent behavior:

- Discipline score  
- Focus score  
- Curiosity score  
- Impulsivity score  
- Recent session duration  
- Recent binge count  
- Recent abandonment rate  

---

### B. Context Features

- Time of day (encoded as sin/cos)
- Day of week
- Device type (mobile, TV, laptop)
- Current session length
- Position in session (start vs deep session)

---

### C. Content Features

You MUST represent the content:

- Genre (one-hot or embedding)
- Popularity score
- Length (episode duration)
- Series vs movie
- Familiarity:
  - new vs previously watched
  - part of ongoing series

---

### D. Interaction Features

- Recommendation rank position
- Whether user searched vs browsed
- Previous interaction with similar content
- Time spent browsing before click

---

## 1.3 Model Inputs

```
X = [
user_features,
context_features,
content_features,
interaction_features
]
```
id="click_inp_01"

---

## 1.4 Models

### Click Likelihood
- Model: Logistic Regression / XGBoost
- Output:
```
P(click | user, content, context)
```
id="click_out_01"

---

### Abandonment Probability
- Model: Logistic Regression / Gradient Boosting
- Output:
```
P(abandon | session, content, user)
```
id="abandon_out_01"

---

## 1.5 Key Signals

Strong predictors:

- High impulsivity → higher click probability  
- Long session duration → higher abandonment  
- Low focus → high abandonment  
- New content → higher abandonment  

---

## 1.6 Edge Cases

- Cold start (no history)
- Missing content metadata
- Extremely short sessions
- Autoplay vs user-initiated

---

# 2. Predictability Score

## 2.1 Objective

Measure how predictable the user's behavior is over time.

---

## 2.2 Intuition

- High predictability → routine-driven  
- Low predictability → chaotic/exploratory  

---

## 2.3 Input Features

- Entropy of actions (WATCH, SEARCH, STOP)
- Entropy of genres
- Variance of session times
- Variance of session duration
- Repetition ratio (rewatch %)

---

## 2.4 Formula

```
Predictability = 100 - (
w1 * action_entropy +
w2 * genre_entropy +
w3 * time_variance +
w4 * duration_variance
)
```
id="pred_score_01"

---

## 2.5 Normalization

- Entropy scaled to [0,1]
- Variance normalized by max observed

---

## 2.6 Interpretation

| Score | Meaning |
|------|--------|
| 80–100 | Highly predictable |
| 50–80  | Moderately stable |
| <50    | Chaotic behavior |

---

## 2.7 Edge Cases

- Sparse data → artificially high predictability
- Seasonal behavior shifts

---

# 3. Behavior Drift Score

## 3.1 Objective

Measure how quickly user behavior is changing over time.

---

## 3.2 Inputs

Compute features over two windows:

- Recent window (last 7 days)
- Baseline window (last 30–60 days)

---

## 3.3 Feature Comparison

Compare:

- Genre distribution
- Session duration
- Watch time patterns
- Behavioral scores

---

## 3.4 Formula

```
Drift = distance(F_recent, F_baseline)
```
Where distance can be:

- Euclidean distance
- KL divergence (for distributions)

id="drift_score_01"
```
Drift Score = normalized distance * 100
```

---

## 3.5 Interpretation

| Score | Meaning           |
| ----- | ----------------- |
| 0–20  | Stable behavior   |
| 20–50 | Moderate change   |
| 50+   | Significant shift |

---

## 3.6 Use Cases

* Detect lifestyle changes
* Detect burnout phases
* Detect new interests

---

## 3.7 Edge Cases

* Small sample size in recent window
* sudden spikes due to single binge

---


# 4. Susceptibility Score

## 4.1 Objective

Estimate how easily user behavior can be influenced.

---

## 4.2 Intuition

Measures responsiveness to:

* recommendations
* autoplay
* trends

---

## 4.3 Input Features

* Click-through rate on recommendations
* Autoplay continuation ratio
* Popular content consumption ratio
* Search vs recommendation ratio
* Time-to-click

---

## 4.4 Formula

```
Susceptibility = 
    w1 * recommendation_ctr +
    w2 * autoplay_ratio +
    w3 * popularity_bias +
    w4 * inverse_decision_time
```
id="sus_score_01"

---

## 4.5 Interpretation

| Score | Meaning |
|------|--------|
| 80–100 | Highly influenceable |
| 50–80  | Moderately influenceable |
| <50    | Independent behavior |

---

## 4.6 Signals

- Fast decisions → high susceptibility  
- High autoplay → passive consumption  
- High trending content → external influence  

---

## 4.7 Edge Cases

- New users (no baseline)
- Strong niche preferences
- inconsistent interaction logs

---

# 5. Integration into Prediction Pipeline

---

## 5.1 Extended Output

```
Y = {
action_probs,
expected_duration,
binge_probability,
click_probability,
abandonment_probability,
predictability_score,
drift_score,
susceptibility_score
}
```
id="final_out_01"

---

## 5.2 Pipeline Flow

```
User State → Feature Extraction → Sequence Model
↓
Context + Content Features
↓
Prediction Heads:

* Action
* Duration
* Binge
* Click
* Abandonment
* Meta Scores
```

---

## 5.3 Design Principle

- Keep core model lightweight  
- Add these as **modular heads**  
- Ensure interpretability for each score  

---

## 6. Summary

These extensions allow the system to:

- Predict interaction decisions (click, abandon)
- Quantify behavioral stability (predictability)
- Detect behavioral change (drift)
- Measure influence sensitivity (susceptibility)

This transforms the model into:

> A behavioral simulation engine capable of approximating user decision-making under different contexts.