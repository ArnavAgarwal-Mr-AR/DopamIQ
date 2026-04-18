export const normalizeMeta = (data: any) => {
  return {
    predictability: data.predictability || 0,
    drift: data.drift || 0,
    susceptibility: data.susceptibility || 0,
  };
};