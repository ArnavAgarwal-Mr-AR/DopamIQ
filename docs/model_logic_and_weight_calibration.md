# The Behavioral Heuristic Engine: Model Logic & Weight Calibration

## 1. Philosophical Architecture: Transparent vs. Black Box
Instead of utilizing a "Black Box" Neural Network (which hides its decision-making process), this platform uses a **Transparent Behavioral Heuristic Engine**. This ensures that every insight is 100% explainable and mathematically rooted in your own data footprints.

*   **No Training Data Required**: The engine does not need to see millions of other people's data to understand you. It applies universal behavioral patterns to your specific history.
*   **Explainable AI (XAI)**: If the system calls you "Impulsive," you can trace that exact claim back to the weight of your `autoplay_ratio`.

## 2. How Weight Values are Chosen
The weights defined in `backend/app/scoring/weights.py` are not random. They are calibrated based on the **Significance of User Agency**.

### The Principle of Intent vs. Automation
Weights are chosen by determining how much a specific feature reveals about a user's **conscious choice** vs. **platform manipulation**.

### Case Study: Calibration of "Discipline"
```python
"discipline": {
    "late_night_ratio": 0.4,
    "binge_factor": 0.3,
    "autoplay_ratio": 0.3,
}
```
*   **late_night_ratio (0.4)**: This is the highest weight. Why? Because watching content during biological "Vulnerability Windows" (23:00 - 03:00) is the strongest negative signal for discipline. It indicates a failure to maintain a sleep-schedule boundary.
*   **binge_factor (0.3)** / **autoplay_ratio (0.3)**: These are secondary triggers. While they indicate a loss of control, they are partially influenced by the platform's UI (cliffhangers). Therefore, they are weighted lower than the user's decision of *when* to watch.

### Case Study: Calibration of "Curiosity"
```python
"curiosity": {
    "genre_entropy": 0.4,
    "novelty_score": 0.3,
    "search_activity": 0.3,
}
```
*   **genre_entropy (0.4)**: This is the primary driver. A user who explores 15 genres per year is fundamentally more curious than someone who stays in 2. Breadth of content is the strongest signature of an open-mindset.
*   **novelty_score (0.3)** / **search_activity (0.3)**: These represent "Proactive Exploration." While watching new things (Novelty) and looking for specific titles (Search) are signs of interest, they are secondary to the overall diversity of the menu you consume.

### Case Study: Calibration of "Consistency"
```python
"consistency": {
    "variance_usage": 1.0,
}
```
*   **variance_usage (1.0)**: Consistency is unique in our model because it only has one anchor. In behavioral statistics, a "Consistent Habit" is mathematically defined by a **Lack of Variance**. If you watch every day at 9 PM for 45 minutes, your variance remains near zero, and your score hits 100. Because variance is the *only* mathematical property that defines a habit, it receives the "Defining Anchor" weight of 1.0.

### Case Study: Calibration of "Impulsivity"
```python
"impulsivity": {
    "autoplay_ratio": 0.4,
    "inverse_decision_time": 0.3,
    "binge_factor": 0.3,
}
```
*   **autoplay_ratio (0.4)**: This is the core "Platform Hijack" signal. An impulsive user is 4x more likely to let the algorithm choose their next show for them. Thus, it is the primary weighting for this trait.
*   **inverse_decision_time (0.3)** & **binge_factor (0.3)**: These represent the speed of the "Yes" and the inability to provide a "No." They are critical secondary factors that confirm the impulsive signature.

### The Significance of 0.3 Weights: Why not 0.5?
A frequent weight in our engine is **0.3**. This value represents a **Collaborative Behavior**.

*   **Binge Factor & Autoplay (0.3 in Discipline)**: In behavioral psychology, "Agency" is diluted when a third-party (the UI) is actively pushing for a specific outcome. Because Netflix uses cliffhangers and automatic transitions, the user is only *partially* responsible for the binge. We assign **0.3** because while the user *allowed* it to happen, the platform's "momentum engineering" accounts for a significant portion of the behavior. If the weight were 0.5, we would be unfairly blaming the user for the platform's successful manipulation.
*   **Search Activity & Novelty (0.3 in Curiosity)**: Curiosity is most purely measured by **Genre Entropy** (the variety of the menu). "Search" and "Novelty" are secondary signals. A user can be incredibly curious just by browsing what’s new on their homepage; they don't *have* to search to exhibit curiosity. Thus, search is a "supporting signal" (0.3) rather than a "primary driver."

### Case Study: Calibration of "Focus"
```python
"focus": {
    "completion_rate": 0.5,
    "pause_frequency": 0.25,
    "abandonment_rate": 0.25,
}
```
*   **completion_rate (0.5)**: This is the anchor of the Focus score. If a user starts a title and finishes it, they have exhibited a high "Attention Commitment." This is the most reliable mathematical signal for focus in a distracted digital economy.
*   **pause_frequency (0.25)**: Frequent pausing indicates external distractions or fragmented attention, but it is less significant than a total abandonment of the title.

## 3. Mathematical Normalization
Every weighted sum is passed through a **Normalization Layer** in the `Scoring Engine` to ensure the final result exists on a human-readable 0-100 scale:

1.  **Raw Input**: High/Low ratios from your logs.
2.  **Weight Multiplication**: Applying the significance values above.
3.  **Clamping**: Using `max(0, min(100, score))` to prevent outliers from breaking the UI.

## 4. Technical Rationale: Why we don't "Train" per session
Users often ask why we don't use a "Training Loop" for each upload. The decision is based on three technical pillars:

1.  **Data Volume & Sparsity**: A typical Netflix history contains 500 to 2,000 watch events. Deep Learning models (like Transformers or RNNs) require tens of thousands of data points to achieve convergence. Training on a single CSV would result in the model "memorizing" your noise rather than learning your habits.
2.  **Overfitting Prevention**: If you spent one week watching a single show while sick, a trained model would treat that as a permanent personality shift. Our **Heuristic Engine** uses global behavioral anchors to filter out these "one-off" anomalies, providing a much more stable and accurate long-term profile.
3.  **Low-Latency "Reveal"**: To achieve a sentimental "Reveal Your Shadow" experience, the result must be instant. On-the-fly training would introduce a 20-40 second delay, breaking the emotional momentum of the user's discovery.

## 5. The Predictive Probability Formulas
The "Predictions" section on the dashboard is powered by deterministic probability gates. Here is how they are calculated:

### Click Probability
**Formula**: `0.4 * (Curiosity/100) + 0.3 * Novelty + 0.3 * (Impulsivity/100)`
*   **Meaning**: This represents the platform's confidence that you will engage with a "New" recommendation. It is heavily weighted toward your Curiosity (40%), as curious users are the most likely to click on unfamiliar thumbnails.

### Binge Probability
**Formula**: `0.5 * (Binge_Factor) + 0.3 * (Impulsivity/100) + 0.2 * (1 - Discipline/100)`
*   **Meaning**: The algorithm looks at your historical Binge Factor (50%) as the primary predictor. If your Discipline is low, the probability increases exponentially, representing the "Platform Mastery" over your schedule.

### Abandonment Probability
**Formula**: `0.6 * (1 - Completion_Rate) + 0.4 * (Focus/100)`
*   **Meaning**: This is the "Boredom Index." If you have a history of not finishing shows (60% weight), the model predicts you will likely abandon your current session if the content doesn't "hook" you within the first 7 minutes.

## 6. Why This Fulfills our Mission
By making these weights public and documented, we bridge the power imbalance between the User and the Platform. You aren't just being judged; you are seeing the **Calibration Script** of the judgment itself.
