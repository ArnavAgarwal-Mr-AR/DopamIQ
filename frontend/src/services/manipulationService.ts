import { apiClient } from "./apiClient";

export const fetchManipulationReport = async () => {
  return apiClient("/manipulation");
};
