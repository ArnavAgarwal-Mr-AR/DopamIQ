import React, { useState } from "react";
import SimulationLayout from "./SimulationLayout";
import SimulationForm from "../../features/simulation/SimulationForm";
import SimulationResult from "../../features/simulation/SimulationResult";
import SimulationSummary from "../../features/simulation/SimulationSummary";
import { formatSimulationInput, parseSimulationOutput } from "../../features/simulation/simulation.utils";

const Simulation: React.FC = () => {
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (scenario: any) => {
    const payload = formatSimulationInput(scenario);

    const res = await fetch("/api/llm/simulate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    const parsed = parseSimulationOutput(data.predicted_behavior || data);

    setResult(parsed);
  };

  return (
    <SimulationLayout>
      <SimulationForm onSubmit={handleSubmit} />

      <SimulationResult result={result} />

      {result && <SimulationSummary summary={result.summary} />}
    </SimulationLayout>
  );
};

export default Simulation;