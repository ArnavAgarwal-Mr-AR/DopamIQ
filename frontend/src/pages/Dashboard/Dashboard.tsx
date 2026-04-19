import React from "react";
import DashboardLayout from "./DashboardLayout";
import ScoreSection from "../../features/scores/ScoreSection";
import PredictionSection from "../../features/predictions/PredictionSection";
import MetaSection from "../../features/meta/MetaSection";
import InsightsSection from "../../features/insights/InsightsSection";
import ManipulationReport from "../../features/insights/ManipulationReport";
import SectionContainer from "../../components/layout/SectionContainer";
import SoulSignature from "../../components/ui/SoulSignature";

import { useFetchScores } from "../../hooks/useFetchScores";
import { usePredictions } from "../../hooks/usePredictions";
import { useMeta } from "../../hooks/useMeta";
import { useInsights } from "../../hooks/useInsights";
import { useManipulation } from "../../hooks/useManipulation";

const Dashboard: React.FC = () => {
  const { scores } = useFetchScores();
  const { predictions } = usePredictions();
  const { meta } = useMeta();
  const { data: manipulation, loading: manipulationLoading } = useManipulation();

  const { insights } = useInsights({
    scores,
    predictions,
  });

  return (
    <DashboardLayout>
      <div className="mb-12 space-y-2">
        <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white italic">Welcome back to your reflection.</h2>
        <p className="text-gray-500 text-lg md:text-xl font-medium">The algorithm has been quietly watching your absence.</p>
      </div>

      {insights && (
        <div className="mb-12">
          <InsightsSection
            explanation={insights.explanation}
            insights={insights.insights || []}
          />
        </div>
      )}

      {scores && <ScoreSection scores={scores} />}

      {predictions && (
        <PredictionSection
          click={Math.round(predictions.click_probability * 100)}
          abandonment={Math.round(predictions.abandonment_probability * 100)}
          binge={Math.round(predictions.binge_probability * 100)}
          duration={predictions.expected_duration}
        />
      )}

      {meta && (
        <MetaSection
          predictability={meta.predictability}
          drift={meta.drift}
          susceptibility={meta.susceptibility}
        />
      )}

      <SectionContainer title="Manipulation Intelligence">
        <ManipulationReport data={manipulation} loading={manipulationLoading} />
      </SectionContainer>

      <SoulSignature />
    </DashboardLayout>
  );
};

export default Dashboard;