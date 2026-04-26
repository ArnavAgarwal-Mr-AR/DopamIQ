# DOPAMIQ // Behavioral Scoring Engine

**DOPAMIQ** is a forensic intelligence platform designed to transform raw Netflix usage telemetry into a structured behavioral profile. By analyzing your `ViewingActivity.csv`, the engine constructs a "Behavioral Portrait" that quantifies your relationship with digital consumption through mathematical scoring, temporal mapping, and manipulation detection.

---

## 👁️ The Vision

In an era of algorithmic dominance, **Dopamiq** provides the user with the same depth of behavioral analytics that streaming platforms use internally. It bridges the gap between passive consumption and active self-awareness.

## 🚀 Key Features

- **The Behavioral Portrait**: Quantifies 5 core metrics—Discipline, Focus, Curiosity, Consistency, and Impulsivity—using a multi-dimensional radar system.
- **Temporal Rhythm Analysis**: Maps your "Behavioral Pulse" across daily, monthly, and yearly horizons to identify deep-seated habits.
- **Manipulation Intelligence**: Identifies "Threat Status" by analyzing how platform UI architecture influences your biological decision-making.
- **Neural Audit Dashboard**: A high-fidelity, "Brutalist Noir" interface for visualizing your digital footprint.
- **Privacy First**: Data is processed entirely in-memory. Zero persistence of your raw Netflix history.

## 🛠️ Technical Architecture

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS (Custom "Noir" Design System)
- **Visualization**: Recharts (Customized GL-style components)
- **Analytics**: Vercel Analytics

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Processing Engine**: Polars & DuckDB (for high-speed telemetry parsing)
- **Database**: PostgreSQL + SQLAlchemy (Session-based metadata)
- **Validation**: Pydantic v2 (Strict schema enforcement)

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.9+)
- PostgreSQL (Optional for local dev, recommended for persistence)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/dopamiq.git
   cd dopamiq
   ```

2. **Setup Backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running Locally

1. **Start Backend Server**
   ```bash
   cd backend
   uvicorn app.main:app --reload --port 8000
   ```

2. **Start Frontend Dev Server**
   ```bash
   cd frontend
   npm run dev
   ```

---

## 🌐 Deployment

The project is optimized for **Vercel** using the multi-service deployment strategy.

### Vercel Configuration
Ensure your `vercel.json` maps the frontend to `/` and the backend service to `/api`. The backend code has been pre-configured to handle Vercel's route stripping.

---

## ⚖️ Privacy & Ethics

Dopamiq is built on the principle of **In-Memory Forensics**. 
1. Your `ViewingActivity.zip` is parsed and analyzed in a single session.
2. Raw data is never stored in a permanent database.
3. Your Behavioral Signature is derived and then the source data is discarded.

---

**Dopamiq** // *See the signal in the noise.*
