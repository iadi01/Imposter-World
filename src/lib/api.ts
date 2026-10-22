export const API_BASE =
  typeof window !== "undefined" && window.location.port === "8080"
    ? "http://localhost:4001"
    : "";
