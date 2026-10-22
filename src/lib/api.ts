export const API_BASE = (() => {
  if (typeof window !== "undefined") {
    // If running in browser on production (Render, custom domain, or Vercel)
    if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
      if (window.location.hostname.includes("vercel.app")) {
        return "https://imposter-world.onrender.com";
      }
      // On Render or any deployed production domain, use relative URL
      return "";
    }
    // Local dev: TanStack dev server on 8080 proxies to backend on 4001
    if (window.location.port === "8080") {
      return "http://localhost:4001";
    }
    return "";
  }
  return "";
})();
