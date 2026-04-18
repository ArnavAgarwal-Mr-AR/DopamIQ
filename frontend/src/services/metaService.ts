import { apiClient } from "./apiClient";

export const fetchMeta = async () => {
  return apiClient("/meta");
};