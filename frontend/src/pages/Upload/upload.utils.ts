export const validateFile = (file: File) => {
  const allowed = ["application/json", "text/csv"];
  return allowed.includes(file.type);
};