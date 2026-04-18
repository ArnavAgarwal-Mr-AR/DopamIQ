import React from "react";
import SectionContainer from "../../components/layout/SectionContainer";
import MetaCard from "./MetaCard";
import DriftIndicator from "./DriftIndicator";
import PredictabilityGauge from "./PredictabilityGauge";
import SusceptibilityMeter from "./SusceptibilityMeter";

type Props = {
  predictability: number;
  drift: number;
  susceptibility: number;
};

const MetaSection: React.FC<Props> = ({
  predictability,
  drift,
  susceptibility,
}) => {
  return (
    <SectionContainer title="Meta Metrics">
      <div className="grid grid-cols-3 gap-4">
        <MetaCard title="Predictability">
          <PredictabilityGauge value={predictability} />
        </MetaCard>

        <MetaCard title="Drift">
          <DriftIndicator value={drift} />
        </MetaCard>

        <MetaCard title="Susceptibility">
          <SusceptibilityMeter value={susceptibility} />
        </MetaCard>
      </div>
    </SectionContainer>
  );
};

export default MetaSection;