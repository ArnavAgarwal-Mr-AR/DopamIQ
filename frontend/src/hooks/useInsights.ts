import { useEffect, useState } from "react";
import { fetchInsights } from "../services/llmService";

type Input = {
  scores: any;
  predictions: any;
};

export const useInsights = ({ scores, predictions }: Input) => {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadInsights = async () => {
    if (!scores || !predictions) return;

    try {
      setLoading(true);
      const data = await fetchInsights({ scores, predictions });
      setInsights(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch insights");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, [scores, predictions]);

  return {
    insights,
    loading,
    error,
    refetch: loadInsights,
  };
};