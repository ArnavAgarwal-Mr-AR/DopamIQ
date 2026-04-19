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

  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = days[now.getDay()];
  const hour = now.getHours();
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  const currentTimeString = `${dayName} ${hour12} ${ampm}`;

  return (
    <div className="space-y-4">
      <div className="bg-white border rounded-xl p-6 text-center shadow-sm">
        <h3 className="text-gray-500 text-sm mb-1">Current Context Detected</h3>
        <p className="text-xl font-bold text-gray-800 tracking-tight">{currentTimeString}</p>
        <p className="text-xs text-gray-400 mt-1">Simulating via Desktop Web</p>
      </div>

      <Button onClick={() => onSubmit({ time: currentTimeString, device: "laptop" })} className="w-full">
        Predict Current Behavior
      </Button>
    </div>
  );
};

export default SimulationForm;