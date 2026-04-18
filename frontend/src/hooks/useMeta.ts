import { useEffect, useState } from "react";
import { fetchMeta } from "../services/metaService";

export const useMeta = () => {
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadMeta = async () => {
    try {
      setLoading(true);
      const data = await fetchMeta();
      setMeta(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch meta metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeta();
  }, []);

  return {
    meta,
    loading,
    error,
    refetch: loadMeta,
  };
};