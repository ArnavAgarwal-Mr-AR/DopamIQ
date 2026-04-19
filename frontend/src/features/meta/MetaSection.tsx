import React from "react";
import SectionContainer from "../../components/layout/SectionContainer";

type Props = {
  predictability: number;
  drift: number;
  susceptibility: number;
};

import MetaSpectrum from "./MetaSpectrum";

const MetaSection: React.FC<Props> = ({
  predictability,
  drift,
  susceptibility,
}) => {
  return (
    <SectionContainer title="The Meta Matrix">
      <div className="glass-card p-10 mt-4 overflow-hidden">
        <MetaSpectrum 
          predictability={predictability}
          drift={drift}
          susceptibility={susceptibility}
        />
      </div>
    </SectionContainer>
  );
};

export default MetaSection;