export const normalizePredictions = (data: any) => {
  return {
    click: Math.round((data.click_probability || 0) * 100),
    abandonment: Math.round((data.abandonment_probability || 0) * 100),
    binge: Math.round((data.binge_probability || 0) * 100),
    duration: Math.round(data.expected_duration || 0),
  };
};