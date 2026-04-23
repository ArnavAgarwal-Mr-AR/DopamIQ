# Dopamiq // The Rhythm Engine
## From Historical Reporting to Real-Time Behavioral Simulation

### 1. Core Vision
The Rhythm Engine is not just a graph; it is a **Behavioral Digital Twin**. While the current implementation successfully explains *where you’ve been* (History), the true power of the Rhythm Engine lies in showing you *where the algorithm is taking you* (Real-Time Simulation).

We are shifting the focus from "What did I watch?" to **"How am I being engineered?"**

---

### 2. The Netflix "Product Engineering" Lens
To understand your data, we must view it through the same lens as the engineers at Los Gatos. The Rhythm Engine surfaces the hidden strategies used by modern streaming ecosystems:

*   **Temporal Calibration**: Identifying your "Resistance Minimums" (windows where you are statistically likely to accept a lower-quality content suggestion just to stay in the loop).
*   **Neural Cost Modeling**: Calculating how much "Cognitive Effort" you expend to exit the platform at different times of day.
*   **Thumbnail/UI Mutation**: Predicting which visual triggers (action, comfort, mystery) will have the highest conversion rate based on your current circadian rhythm.
*   **Pre-fetching & Pipeline Warming**: Predicting your next session with enough accuracy to prepare infrastructure before you even pick up your device.

---

### 3. Feature Evolution: The "Neural Prediction HUD"
We will evolve the Rhythm page into a living telemetry dashboard.

#### A. The HUD (Heads-Up Display)
Instead of a static summary, we will implement a real-time **Prediction HUD** that reacts as you adjust the simulation sliders.
*   **The Intent Meter**: A visual readout of your predicted state (e.g., *Sovereign Consumption* vs. *Reactive Binging*).
*   **Telemetry Readouts**: Probability of session start, Predicted Exit Time, and Binge Risk Level.
*   **Neural Half-Life**: A visualization of how "stale" your current behavior is compared to your historical baseline.

#### B. Algorithmic Exploitation Logic (The "Advice")
For every simulated scenario, the engine will provide a "Platform Strategy" brief:
*   *Example*: "In this 1 AM Friday window, the algorithm detects a **Decision Fatigue Corridor**. Strategy: Implement 'No-Choice' auto-play with 3-second countdowns to bypass your pre-frontal cortex."

#### C. Circadian Pulse Animation
The background of the Rhythm page will subtly shift its "Pulse" speed and color based on the selected simulation time — faster and redder during peak binge hours, slower and calmer during disciplined morning windows.

---

### 4. Technical Implementation Roadmap
1.  **HUD Component**: Create `PredictionHUD.tsx` to visualize the `action`, `probability`, and `duration` returned by the `/api/llm/simulate` endpoint.
2.  **Contextual Optimization**: Update `llm_service.py` to generate explicit "Algorithm Strategy" strings that reveal how a platform would exploit the current user state.
3.  **Real-Time Triggering**: Bind the Simulation Form's `onChange` events to the API to make the HUD feel reactive and "alive."

---

> [!IMPORTANT]
> **Design Goal**: The Rhythm page should feel less like a "User Dashboard" and more like a "Forensic Telemetry Station" inside a digital ethics lab.