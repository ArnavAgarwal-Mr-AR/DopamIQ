import { useEffect, useState } from "react";
import { fetchPredictions } from "../services/predictionService";

export const usePredictions = () => {
  const [predictions, setPredictions] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadPredictions = async () => {
    try {
      setLoading(true);
      const data = await fetchPredictions();
      setPredictions(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch predictions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPredictions();
  }, []);

  return {
    predictions,
    loading,
    error,
    refetch: loadPredictions,
  };
};