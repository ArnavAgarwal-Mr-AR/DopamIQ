import { apiClient } from "./apiClient";

export const fetchScores = async () => {
  return apiClient("/scores");
};