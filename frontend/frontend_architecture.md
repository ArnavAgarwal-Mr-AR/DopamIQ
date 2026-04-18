# Frontend Architecture Documentation

## 1. Overview

The frontend is a modular React-based dashboard that visualizes:

- Behavioral scores
- Predictions
- Meta metrics
- LLM-generated insights
- Simulation outputs

It follows a **feature-driven architecture** aligned with backend services.

---

## 2. Design Principles

### 2.1 Feature-Based Architecture
Each domain (scores, predictions, meta, insights) is isolated.

### 2.2 Backend Alignment
Frontend mirrors backend services to ensure consistency.

### 2.3 State Centralization
All server data is stored in Zustand stores.

---

## 3. Folder Explanation

---

### `/app`

Core app setup:

- App.tsx → root component
- routes.tsx → routing config
- providers.tsx → global providers (store, theme)

---

### `/pages`

Route-level pages:

- Dashboard → main overview
- Trends → time-series analysis
- Simulation → what-if engine
- Upload → dataset ingestion

---

### `/features`

Feature-specific modules:

#### `/scores`
- ScoreCard.tsx
- ScoreRadarChart.tsx

#### `/predictions`
- PredictionPanel.tsx

#### `/meta`
- MetaMetricsCard.tsx

#### `/insights`
- InsightsPanel.tsx (LLM outputs)

#### `/simulation`
- ScenarioInput.tsx
- SimulationResult.tsx

---

### `/components`

Reusable UI elements:

#### `/ui`
- Button
- Card
- Loader

#### `/layout`
- Navbar
- Sidebar

#### `/charts`
- RadarChart wrapper
- LineChart wrapper

---

### `/services`

Handles API calls.

- apiClient.ts → base fetch wrapper
- scoreService.ts → GET /scores
- predictionService.ts → GET /predictions
- metaService.ts → GET /meta
- llmService.ts → POST /llm/*
- uploadService.ts → POST /upload

---

### `/stores`

Zustand global state.

Example:
- useScoreStore → stores score data
- usePredictionStore → prediction data

---

### `/hooks`

Custom hooks for data fetching.

Examples:
- useFetchScores
- usePredictions

Handles:
- API calls
- loading states
- error handling

---

### `/types`

TypeScript interfaces for API responses.

Ensures:
- type safety
- backend compatibility

---

### `/utils`

Helper functions:

- format numbers
- validation
- constants

---

### `/config`

Environment configuration.

---

## 4. Data Flow

API → Service → Hook → Store → Component → UI

---

## 5. Page Responsibilities

### Dashboard
- Scores
- Predictions
- Insights
- Meta metrics

### Trends
- Score trends
- Behavioral drift

### Simulation
- Input scenario
- Show predicted behavior

---

## 6. API Mapping

| Endpoint | Service |
|--------|--------|
| /scores | scoreService |
| /predictions | predictionService |
| /meta | metaService |
| /llm/explain | llmService |
| /llm/simulate | llmService |

---

## 7. Performance Strategy

- Lazy load pages
- Cache API responses
- Memoize charts

---

## 8. Error Handling

- Global error boundary
- API error fallback
- Loading skeletons

---

## 9. Future Improvements

- Real-time updates (WebSockets)
- Dark mode
- User authentication