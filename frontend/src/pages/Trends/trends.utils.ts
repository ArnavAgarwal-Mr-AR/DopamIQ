export const extractMetric = (data: any[], key: string) => {
  return data.map((d) => ({
    name: d.date,
    value: d[key],
  }));
};