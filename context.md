# Behavioral Scoring Engine (BSE)
## Complete Technical Documentation



## 1. Overview

### 1.1 Objective
The Behavioral Scoring Engine (BSE) is a system designed to transform raw Netflix user data into a structured, interpretable behavioral profile. The system quantifies user behavior through mathematically grounded scores, identifies behavioral archetypes, and tracks behavioral trends over time.

### 1.2 Core Output
- Behavioral Scores:
  - Discipline
  - Focus
  - Curiosity
  - Consistency
  - Impulsivity
- Archetype Classification
- Behavioral Trends (time series)
- Insights and recommendations

### 1.3 Key Principle
The system does not attempt to infer identity directly. Instead, it models:
- Time allocation
- Decision-making behavior
- Attention patterns



## 2. System Architecture

### 2.1 High-Level Architecture

```

Raw Dataset (CSV/JSON)
↓
Data Processing Layer
↓
Event Normalization Layer
↓
Sessionization Engine
↓
Feature Engineering Layer
↓
Scoring Engine
↓
Archetype Engine
↓
Insight Generator
↓
API Layer
↓
Frontend Dashboard

```



## 3. Data Sources

### 3.1 Required Tables (from dataset)
- ViewingActivity
- PlaybackRelatedEvents
- SearchHistory
- Ratings
- Clickstream
- Devices
- IP Addresses

### 3.2 Optional Tables
- MyList
- IndicatedPreferences
- Messages
- BillingHistory



## 4. Data Processing Layer

### 4.1 Parsing Strategy
- Convert all files into DataFrames
- Standardize column names
- Normalize timestamps to UTC

### 4.2 Data Cleaning
- Remove null or corrupted rows
- Handle missing timestamps
- Drop events with duration < 10 seconds

### 4.3 Edge Cases
- Duplicate entries across tables
- Missing device or country
- Partial session logs



## 5. Event Normalization

### 5.1 Unified Event Schema

```

{
event_id: string,
timestamp: datetime,
event_type: string,   // watch, search, click, rate
title: string,
duration: float,
device: string,
metadata: dict
}

```

### 5.2 Event Types
- WATCH
- SEARCH
- CLICK
- RATE

### 5.3 Edge Cases
- Multiple events with identical timestamps
- Missing duration in playback events
- Autoplay vs user-initiated plays



## 6. Sessionization Engine

### 6.1 Definition
A session is a group of events separated by less than a threshold gap.

### 6.2 Rules
- New session if gap > 30 minutes
- Merge overlapping events

### 6.3 Output Schema

```

{
session_id: string,
start_time: datetime,
end_time: datetime,
total_duration: float,
num_titles: int,
binge_flag: boolean
}

```

### 6.4 Edge Cases
- Long idle periods within sessions
- Background playback
- Device switching mid-session



## 7. Feature Engineering

### 7.1 Time Features
- avg_session_duration
- late_night_ratio (23:00–03:00)
- weekend_usage_ratio

### 7.2 Binge Features
- avg_titles_per_session
- max_binge_length
- autoplay_chain_ratio

### 7.3 Decision Features
- search_to_play_ratio
- avg_decision_time
- abandonment_rate

### 7.4 Attention Features
- completion_rate
- pause_frequency
- rewind_ratio

### 7.5 Taste Features
- genre_entropy
- rewatch_ratio
- novelty_score

### 7.6 Stability Features
- std_dev_watch_time
- weekly_variance
- behavior_drift

### 7.7 Edge Cases
- Missing genre metadata
- Incomplete playback logs
- Sparse user activity



## 8. Scoring Engine

### 8.1 Normalization
All features must be scaled to [0, 1] before scoring.

### 8.2 Discipline Score

```

D = 100
- w1 * binge_length_norm
- w2 * late_night_ratio
- w3 * autoplay_ratio

```

### 8.3 Focus Score

```

F = w1 * completion_rate
- w2 * pause_frequency
- w3 * abandonment_rate

```

### 8.4 Curiosity Score

```

C = w1 * genre_entropy
+ w2 * novelty_score
+ w3 * search_activity

```

### 8.5 Consistency Score

```

S = 100 - variance_in_usage

```

### 8.6 Impulsivity Score

```

I = w1 * autoplay_ratio
+ w2 * inverse_decision_time
+ w3 * binge_sessions

```

### 8.7 Weight Calibration
- Start with equal weights
- Tune via:
  - empirical observation
  - percentile-based scaling

### 8.8 Edge Cases
- Zero-division errors
- Sparse feature values
- Outliers (extreme binge sessions)



## 9. Archetype Engine

### 9.1 Rule-Based Approach

```

if Curiosity > 70 and Impulsivity > 60:
"Curious Binger"

if Discipline > 70 and Focus > 70:
"Intentional Optimizer"

```

### 9.2 ML-Based Approach
- Algorithm: K-Means or Gaussian Mixture Models
- Input: normalized score vector
- Output: cluster label

### 9.3 Edge Cases
- Overlapping clusters
- unstable cluster assignments
- insufficient data



## 10. Trend Analysis

### 10.1 Time Window
- Weekly aggregation
- Rolling average smoothing

### 10.2 Outputs
- score trends over time
- drift detection

### 10.3 Edge Cases
- missing weeks
- inconsistent activity



## 11. Prediction Layer

### 11.1 Models
- Logistic Regression (binge probability)
- Linear Regression (session duration)

### 11.2 Inputs
- recent sessions
- recent scores
- time features

### 11.3 Edge Cases
- insufficient training data
- concept drift



## 12. Insight Engine

### 12.1 Insight Types
- Behavioral patterns
- anomalies
- correlations

### 12.2 Example Rules
- late_night_ratio > threshold → "Late-night usage is high"
- high abandonment → "Low content satisfaction"



## 13. Backend Architecture

### 13.1 Framework
- FastAPI (Python)

### 13.2 Endpoints

```

GET /scores
GET /trends
GET /archetype
GET /insights
POST /upload-data

```

### 13.3 Data Flow
- ingest data
- process pipeline
- cache results

### 13.4 Edge Cases
- large file uploads
- API latency
- concurrent requests



## 14. Frontend Architecture

### 14.1 Framework
- React
- Zustand (state management)

### 14.2 Components
- IdentityCard
- ScoreVisualization
- TrendChart
- InsightsPanel

### 14.3 Visualization Tools
- Recharts
- D3.js (optional)



## 15. Database Design

### 15.1 Recommended
- PostgreSQL (structured storage)
- DuckDB (analytics)

### 15.2 Tables
- events
- sessions
- features
- scores
- insights



## 16. Tech Stack

### 16.1 Backend
- Python
- FastAPI
- Pandas / Polars
- Scikit-learn

### 16.2 Frontend
- React

### 16.3 Storage
- PostgreSQL

### 16.4 Deployment
- Backend: Render / Fly.io
- Frontend: Vercel
- Storage: Supabase / Neon



## 17. Performance Considerations

- Use columnar storage (DuckDB/Parquet)
- Batch processing for feature generation
- Cache computed scores



## 18. Security Considerations

- Sensitive data anonymization
- Secure API endpoints
- rate limiting



## 19. Limitations

- No direct emotional inference
- Limited to observable behavior
- dependent on data completeness



## 20. Future Extensions

- Multi-platform data integration
- real-time scoring
- reinforcement learning for recommendations



## 21. Conclusion

This system provides a structured approach to quantifying behavioral patterns from passive consumption data. It is extensible, interpretable, and suitable for both research and product applications.