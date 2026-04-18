export const isValidNumber = (value: any) => {
  return typeof value === "number" && !isNaN(value);
};

export const isValidFile = (file: File) => {
  const allowedTypes = ["application/json", "text/csv"];
  return allowedTypes.includes(file.type);
};