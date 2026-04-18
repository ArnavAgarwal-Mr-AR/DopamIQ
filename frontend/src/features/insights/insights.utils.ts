export const formatInsights = (raw: any[]) => {
  return raw.map((item) => ({
    title: item.title || "Insight",
    description: item.description || "",
  }));
};