# Dopamiq API Contract

> **Last updated:** April 2026  
> This is the single source of truth for frontend ↔ backend communication.

---

## Global Requirements

| Requirement | Detail |
|-------------|--------|
| Base URL | `/api` |
| Auth header | `X-User-ID: <uuid>` — read from `localStorage["netflix_user_id"]` |
| Default identity | `"guest"` (zero data) if header is absent |
| Timezone | All timestamps processed as `Asia/Kolkata` (+05:30) |
| Content-Type | `application/json` for all non-upload requests |

---

## Endpoints

### `GET /api/scores`
Behavioral portrait scores for the authenticated user.

```json
{
  "discipline":   92.4,
  "focus":         3.4,
  "curiosity":    67.6,
  "consistency": 100.0,
  "impulsivity":  16.0
}
```

| Field | Type | Range | Description |
|-------|------|-------|-------------|
| discipline | float | 0–100 | Inverse of late-night + binge watching |
| focus | float | 0–100 | Completion rate minus abandonment |
| curiosity | float | 0–100 | Title diversity and novelty-seeking |
| consistency | float | 0–100 | Day-of-week entropy (scheduling regularity) |
| impulsivity | float | 0–100 | Autoplay reliance + binge tendency |

---

### `GET /api/predictions`
Forward-looking behavioral risk assessments.

```json
{
  "click_probability":        0.76,
  "abandonment_probability":  0.97,
  "binge_probability":        0.24,
  "expected_duration":        15.0
}
```

| Field | Type | Range | Description |
|-------|------|-------|-------------|
| click_probability | float | 0.0–1.0 | Likelihood of starting a new session |
| abandonment_probability | float | 0.0–1.0 | Likelihood of abandoning mid-watch |
| binge_probability | float | 0.0–1.0 | Likelihood of binge session |
| expected_duration | float | minutes | Predicted session length |

---

### `GET /api/meta`
System-level behavioral alignment metrics.

```json
{
  "predictability": 72.0,
  "drift":          18.0,
  "susceptibility": 45.0
}
```

| Field | Type | Range | Description |
|-------|------|-------|-------------|
| predictability | float | 0–100 | How algorithmically predictable viewing is |
| drift | float | 0–100 | Shift from historical baseline |
| susceptibility | float | 0–100 | Vulnerability to platform recommendation hooks |

---

### `GET /api/manipulation`
Platform influence assessment.

```json
{
  "metrics": [
    {
      "id":          "autoplay_grip",
      "label":       "Autoplay Grip",
      "value":       "88%",
      "description": "Percentage of sessions where autoplay drove the next play",
      "color":       "#ef4444"
    }
  ],
  "summary": "A high probability that your biological decision-making has been substituted..."
}
```

| Field | Type | Description |
|-------|------|-------------|
| metrics | array | List of manipulation metric objects |
| metrics[].id | string | Unique identifier |
| metrics[].label | string | Display name |
| metrics[].value | string | Formatted value (e.g. `"88%"`) |
| metrics[].description | string | Forensic rationale shown on hover |
| metrics[].color | string | Hex color for UI |
| summary | string | Final intelligence memo (prose) |

---

### `GET /api/trends/signals?view={day|month}`
Powers the Behavioral Forecast Graph.

**Query param:** `view` = `"day"` or `"month"`

**Day view response** — 24 items, one per hour:
```json
[
  { "label": "00", "prob": 28, "duration": 8.0, "binge": 8 },
  { "label": "01", "prob": 62, "duration": 10.0, "binge": 15 },
  ...
]
```

**Month view response** — one item per calendar day with activity:
```json
[
  { "label": "2022-03-14", "prob": 45, "duration": 6.5, "binge": 10 },
  { "label": "2022-03-15", "prob": 80, "duration": 12.0, "binge": 30 },
  ...
]
```

| Field | Type | Description |
|-------|------|-------------|
| label | string | `"HH"` (day view) or `"YYYY-MM-DD"` (month view) |
| prob | int | 0–100. Relative session density vs peak hour/day |
| duration | float | Average session duration in **minutes** for that slot |
| binge | int | 0–100. Average binge rate % for that slot |

> **Note:** `prob` is normalized — the busiest slot = 100, others are proportional.

---

### `POST /api/llm/simulate`
Generates the Intelligence Brief for the simulation panel.

**Request:**
```json
{ "scenario": { "mode": "day" } }
```

**Response:**
```json
{
  "action":      "Comparative Diagnostic Complete",
  "probability": 0.45,
  "summary":     "ANALYSIS REASON: ... | ALGORITHMIC GRIP: ... | NEURAL COST: ...",
  "duration":    8,
  "binge":       false
}
```

| Field | Type | Description |
|-------|------|-------------|
| action | string | Brief status label |
| probability | float | 0.0–1.0. Current cycle vulnerability |
| summary | string | Three analytical blocks joined by ` \| ` pipe separator |
| duration | int | Active cycle average duration in minutes |
| binge | bool | True if current cycle exceeds historical average |

> **Summary format:** `"BLOCK 1 | BLOCK 2 | BLOCK 3"` — the frontend splits on `|` to render each block as a separate paragraph.

---

### `POST /api/llm/explain`
High-level behavioral archetype explanation for the dashboard.

**Request:**
```json
{ "scores": { "discipline": 92, ... }, "predictions": { "binge_probability": 0.24, ... } }
```

**Response:**
```json
{
  "title":       "Intentional Optimizer",
  "summary":     "The algorithm has memorized the contours of your boredom...",
  "traits":      ["Deep Focus", "Explorer"]
}
```

| Field | Type | Description |
|-------|------|-------------|
| title | string | Behavioral archetype label |
| summary | string | Long-form clinical analysis prose |
| traits | string[] | 1–3 trait labels |

---

### `POST /api/upload`
Ingests a Netflix `ViewingActivity.zip` export.

**Request:** `multipart/form-data` with field `file`  
**Header:** `X-User-ID: <uuid>` — **required**

**Response:**
```json
{
  "job_id": "uuid",
  "status": "completed",
  "total_sessions": 5343
}
```

---

## User Identity Flow

```
First upload
  └── Browser generates crypto.randomUUID()
  └── Sends as X-User-ID header
  └── Stores in localStorage["netflix_user_id"]
  └── All data saved under this UUID in DB

All subsequent requests
  └── apiClient.ts reads localStorage["netflix_user_id"]
  └── Attaches as X-User-ID header
  └── Backend queries only that user's rows

No header sent
  └── Backend defaults to "guest"
  └── Guest has no data → empty responses
```
