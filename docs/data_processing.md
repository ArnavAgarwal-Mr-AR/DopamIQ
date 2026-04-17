# Data Processing Specification

## 1. Overview

The Data Processing layer is responsible for transforming raw Netflix user dataset files into structured, clean, and unified data suitable for:

- Feature engineering  
- Behavioral modeling  
- Prediction pipelines  

This layer is **critical**, as all downstream models depend entirely on the quality of processed data.

---

## 2. Input Dataset Structure

The system ingests multiple files described in the dataset cover sheet. Key files include:

---

### 2.1 Core Behavioral Files (Primary)

| File | Purpose |
|------|--------|
| ViewingActivity | Core watch history |
| PlaybackRelatedEvents | Fine-grained playback actions |
| SearchHistory | User search behavior |
| Clickstream | Navigation behavior |
| Ratings | Explicit preferences |

---

### 2.2 Supporting Context Files

| File | Purpose |
|------|--------|
| Devices | Device usage patterns |
| IP Addresses | Location + session context |
| MyList | Intent signals |
| IndicatedPreferences | Initial preference signals |

---

### 2.3 Optional / Low Priority

- Customer_Service  
- Messages  
- BillingHistory  
- Surveys  
- Games  

---

## 3. Data Processing Pipeline

---

### 3.1 High-Level Flow
```
Raw Files
↓
Parsing
↓
Cleaning
↓
Normalization
↓
Event Unification
↓
Sessionization
↓
Processed Dataset
```

---

## 4. File-Level Processing

---

### 4.1 ViewingActivity

#### Key Fields:
- Start Time
- Duration
- Title
- Device Type
- Attributes

#### Processing Steps:
- Convert `Start Time` → datetime (UTC)
- Normalize `Duration` → seconds
- Extract:
  - autoplay flag
  - interaction type

#### Edge Cases:
- Duration < 10 seconds → discard
- Hidden views → optional exclusion

---

### 4.2 PlaybackRelatedEvents

#### Key Fields:
- eventType (start, pause, seek, stop)
- timestamps
- offsets

#### Processing:
- Flatten playtraces
- Extract:
  - pause count
  - rewind count
  - seek behavior

#### Edge Cases:
- Missing playtraces
- inconsistent offsets

---

### 4.3 SearchHistory

#### Key Fields:
- Query Typed
- Action (play, view, add)
- Timestamp

#### Processing:
- Map actions:
  - search → click → play chain
- Compute:
  - search-to-play transitions

---

### 4.4 Clickstream

#### Key Fields:
- Navigation Level
- Source (device)
- Timestamp

#### Processing:
- Track navigation sequences
- Compute:
  - browsing depth
  - time spent before action

---

### 4.5 Ratings

#### Key Fields:
- Thumbs / Stars
- Title
- Timestamp

#### Processing:
- Normalize ratings:
  - thumbs → numeric scale
- Track preference strength

---

### 4.6 Devices

#### Processing:
- Map device usage
- Track:
  - mobile vs TV vs desktop ratio

---

### 4.7 IP Addresses

#### Processing:
- Extract:
  - country
  - region
  - approximate location

#### Note:
- Use only for context (not precise location)

---

## 5. Data Cleaning

---

### 5.1 Missing Values

- Replace with:
  - defaults
  - inferred values
- Drop rows if critical fields missing

---

### 5.2 Duplicate Handling

- Remove identical rows
- Deduplicate by:
  - timestamp + title + device

---

### 5.3 Time Standardization

- Convert all timestamps → UTC
- Align across files

---

### 5.4 Invalid Data

- Negative durations → discard
- corrupted entries → remove

---

## 6. Event Unification

---

### 6.1 Objective

Convert all data into a unified event stream.

---

### 6.2 Unified Schema
```
{
event_id,
timestamp,
event_type,
title,
duration,
device,
metadata
}
```

---

### 6.3 Event Types

- WATCH
- SEARCH
- CLICK
- RATE
- NAVIGATION

---

### 6.4 Mapping

| Source | Event Type |
|-------|-----------|
| ViewingActivity | WATCH |
| SearchHistory | SEARCH |
| Clickstream | CLICK |
| Ratings | RATE |

---

## 7. Sessionization

---

### 7.1 Definition

A session = continuous user activity window.

---

### 7.2 Rules

- New session if gap > 30 minutes
- Merge overlapping events

---

### 7.3 Output
```
{
session_id,
start_time,
end_time,
duration,
num_events,
num_titles,
binge_flag
}
```

---

### 7.4 Edge Cases

- Background autoplay
- multi-device sessions
- long idle gaps

---

## 8. Derived Signals

---

### 8.1 Behavioral Signals

- autoplay vs user action
- interaction intensity
- engagement depth

---

### 8.2 Temporal Signals

- time-of-day usage
- weekday/weekend patterns

---

### 8.3 Decision Signals

- search → play latency
- abandonment patterns

---

## 9. Data Storage

---

### 9.1 Intermediate Storage

- Store processed data in:
  - Parquet files (recommended)
  - DuckDB tables

---

### 9.2 Final Tables

- events
- sessions
- aggregated_logs

---

## 10. Performance Optimization

---

### 10.1 Techniques

- Use Polars instead of Pandas
- Columnar storage (Parquet)
- Batch processing

---

### 10.2 Large Dataset Handling

- chunk processing
- lazy evaluation

---

## 11. Validation

---

### 11.1 Checks

- session continuity
- timestamp consistency
- feature sanity checks

---

### 11.2 Metrics

- % missing values
- duplicate rate
- processed vs raw ratio

---

## 12. Edge Cases Summary

- Missing files or tables  
- Empty datasets  
- Sparse user activity  
- Inconsistent timestamps  
- Multiple profiles in same dataset  

---

## 13. Limitations

- No ground truth labels  
- Incomplete logs possible  
- limited to Netflix ecosystem  

---

## 14. Summary

The data processing layer:

- transforms raw logs into structured events  
- builds sessions  
- extracts behavioral signals  

It ensures that downstream models receive:

- clean  
- consistent  
- interpretable data  

This layer directly determines the quality of all predictions and scores.

