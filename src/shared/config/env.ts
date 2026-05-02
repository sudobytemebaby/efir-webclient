function required(key: string): string {
  const value = import.meta.env[key];
  if (!value) throw new Error(`Missing env variable: ${key}`);
  return value;
}

export const env = {
  apiUrl: required("VITE_API_URL"),
  wsUrl: required("VITE_WS_URL"),
} as const;
