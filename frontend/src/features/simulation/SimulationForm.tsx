import React, { useState } from "react";
import ScenarioInputs from "./ScenarioInputs";
import Button from "../../components/ui/Button";

type Props = {
  onSubmit: (scenario: any) => void;
};

const SimulationForm: React.FC<Props> = ({ onSubmit }) => {
  const [scenario, setScenario] = useState({
    time: "",
    device: "mobile",
  });

  const handleChange = (field: string, value: string) => {
    setScenario((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <ScenarioInputs scenario={scenario} onChange={handleChange} />

      <Button onClick={() => onSubmit(scenario)}>
        Run Simulation
      </Button>
    </div>
  );
};

export default SimulationForm;