import { useEffect, useState } from "react";
import { fetchScores } from "../services/scoreService";

export const useFetchScores = () => {
  const [scores, setScores] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadScores = async () => {
    try {
      setLoading(true);
      const data = await fetchScores();
      setScores(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch scores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScores();
  }, []);

  return {
    scores,
    loading,
    error,
    refetch: loadScores,
  };
};