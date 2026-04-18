import { apiClient } from "./apiClient";

export const fetchPredictions = async () => {
  return apiClient("/predictions");
};