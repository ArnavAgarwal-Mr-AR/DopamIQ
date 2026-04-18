import React from "react";
import GaugeChart from "../../components/charts/GaugeChart";

type Props = {
  value: number;
};

const PredictabilityGauge: React.FC<Props> = ({ value }) => {
  return <GaugeChart value={value} label="Predictability" />;
};

export default PredictabilityGauge;