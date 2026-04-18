export const formatTrendData = (data: any[]) => {
  return data.map((d) => ({
    name: d.date,
    value: d.value,
  }));
};