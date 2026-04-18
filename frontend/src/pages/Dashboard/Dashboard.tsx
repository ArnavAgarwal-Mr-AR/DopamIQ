import React from "react";
import DashboardLayout from "./DashboardLayout";
import ScoreSection from "../../features/scores/ScoreSection";
import PredictionSection from "../../features/predictions/PredictionSection";
import MetaSection from "../../features/meta/MetaSection";
import InsightsSection from "../../features/insights/InsightsSection";

import { useFetchScores } from "../../hooks/useFetchScores";
import { usePredictions } from "../../hooks/usePredictions";
import { useMeta } from "../../hooks/useMeta";
import { useInsights } from "../../hooks/useInsights";

const Dashboard: React.FC = () => {
  const { scores } = useFetchScores();
  const { predictions } = usePredictions();
  const { meta } = useMeta();

  const { insights } = useInsights({
    scores,
    predictions,
  });

  return (
    <DashboardLayout>
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

      {insights && (
        <InsightsSection
          explanation={insights.explanation}
          insights={insights.insights || []}
        />
      )}
    </DashboardLayout>
  );
};

export default Dashboard;