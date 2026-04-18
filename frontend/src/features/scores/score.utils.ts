export const formatScores = (data: any) => {
  return [
    { subject: "Discipline", value: data.discipline || 0 },
    { subject: "Focus", value: data.focus || 0 },
    { subject: "Curiosity", value: data.curiosity || 0 },
    { subject: "Consistency", value: data.consistency || 0 },
    { subject: "Impulsivity", value: data.impulsivity || 0 },
  ];
};