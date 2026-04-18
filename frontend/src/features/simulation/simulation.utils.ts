export const formatSimulationInput = (scenario: any) => {
  return {
    scenario: {
      time: scenario.time,
      device: scenario.device,
    },
  };
};

export const parseSimulationOutput = (data: any) => {
  return {
    action: data.action || "",
    probability: data.probability || 0,
    duration: data.duration || 0,
    binge: data.binge || false,
    summary: data.summary || "",
  };
};