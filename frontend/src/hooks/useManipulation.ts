import { useState, useEffect } from "react";
import { fetchManipulationReport } from "../services/manipulationService";

export const useManipulation = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchManipulationReport();
        setData(res);
      } catch (e) {
        console.error("Failed to load manipulation report");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { data, loading };
};
