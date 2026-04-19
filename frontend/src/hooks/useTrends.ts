import { useEffect, useState } from "react";
import { fetchTrends } from "../services/trendService";

export const useTrends = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetchTrends();
    setData(res);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return { data, loading };
};