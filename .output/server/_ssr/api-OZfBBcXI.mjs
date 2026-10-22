//#region node_modules/.nitro/vite/services/ssr/assets/api-OZfBBcXI.js
var API_BASE = (() => {
	if (typeof window !== "undefined") {
		if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
			if (window.location.hostname.includes("vercel.app")) return "https://imposter-world.onrender.com";
			return "";
		}
		if (window.location.port === "8080") return "http://localhost:4001";
		return "";
	}
	return "";
})();
//#endregion
export { API_BASE as t };
