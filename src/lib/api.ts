export const API_BASE =
  (import.meta.env.VITE_SERVER_URL as string | undefined) ||
  (typeof window !== "undefined" && window.location.port === "8080"
    ? "http://localhost:4001"
    : "");
