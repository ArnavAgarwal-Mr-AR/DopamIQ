import React, { useState } from "react";
import SimulationLayout from "./SimulationLayout";
import SimulationForm from "../../features/simulation/SimulationForm";
import SimulationResult from "../../features/simulation/SimulationResult";
import SimulationSummary from "../../features/simulation/SimulationSummary";
import { formatSimulationInput, parseSimulationOutput } from "../../features/simulation/simulation.utils";
import { apiClient } from "../../services/apiClient";
import type { ViewMode } from "../../features/simulation/BehavioralForecastGraph";

const Simulation: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (scenario: any) => {
    setLoading(true);
    const payload = formatSimulationInput(scenario);

    try {
      const data = await apiClient("/llm/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const parsed = parseSimulationOutput(data.predicted_behavior || data);
      setResult(parsed);
    } catch {
      // apiClient handles session expiry redirect
    } finally {
      setLoading(false);
    }
  };

  return (
    <SimulationLayout>
      <SimulationForm onSubmit={handleSubmit} />
      
      {/* Simulation Result: HUD + Strategy Brief */}
      <SimulationSummary data={result} loading={loading} view="day" />
    </SimulationLayout>
  );
};


export default Simulation;