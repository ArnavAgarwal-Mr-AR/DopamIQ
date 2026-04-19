import { apiClient } from "./apiClient";

export const fetchTrends = async () => {
  return apiClient("/trends");
};