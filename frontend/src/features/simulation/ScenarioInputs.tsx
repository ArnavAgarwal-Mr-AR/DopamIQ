import React from "react";

type Props = {
  scenario: {
    time: string;
    device: string;
  };
  onChange: (field: string, value: string) => void;
};

const ScenarioInputs: React.FC<Props> = ({ scenario, onChange }) => {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-gray-500">Time</label>
        <input
          type="text"
          value={scenario.time}
          onChange={(e) => onChange("time", e.target.value)}
          className="w-full border rounded px-2 py-1 text-sm"
          placeholder="e.g. Friday 11 PM"
        />
      </div>

      <div>
        <label className="text-xs text-gray-500">Device</label>
        <select
          value={scenario.device}
          onChange={(e) => onChange("device", e.target.value)}
          className="w-full border rounded px-2 py-1 text-sm"
        >
          <option value="mobile">Mobile</option>
          <option value="tv">TV</option>
          <option value="laptop">Laptop</option>
        </select>
      </div>
    </div>
  );
};

export default ScenarioInputs;