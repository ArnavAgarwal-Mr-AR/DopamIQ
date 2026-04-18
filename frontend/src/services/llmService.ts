import { apiClient } from "./apiClient";

export const fetchInsights = async (payload: any) => {
  return apiClient("/llm/explain", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const simulateBehavior = async (payload: any) => {
  return apiClient("/llm/simulate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};