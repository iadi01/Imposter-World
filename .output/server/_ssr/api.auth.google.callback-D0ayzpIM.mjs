import { o as __toESM } from "../_runtime.mjs";
import { t as API_BASE } from "./api-6A2QlK4P.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as LoaderCircle, X as CircleAlert, nt as ArrowLeft } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api.auth.google.callback-D0ayzpIM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GoogleCallbackPage() {
	const navigate = useNavigate();
	const [status, setStatus] = (0, import_react.useState)("loading");
	const [errorMessage, setErrorMessage] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const params = new URLSearchParams(window.location.search);
		const code = params.get("code");
		const error = params.get("error");
		if (error) {
			setStatus("error");
			setErrorMessage(`Google sign-in was cancelled or denied: ${error}`);
			return;
		}
		if (!code) {
			setStatus("error");
			setErrorMessage("Missing authorization code from Google.");
			return;
		}
		fetch(`${API_BASE}/api/auth/google/callback`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ code })
		}).then(async (res) => {
			const data = await res.json();
			if (!res.ok || !data.success) throw new Error(data.error || "Failed to authenticate with Google.");
			setStatus("success");
			setTimeout(() => {
				window.location.href = "/?login=success";
			}, 300);
		}).catch((err) => {
			console.error("[OAuth] Exchange error:", err);
			setStatus("error");
			setErrorMessage(err.message || "Failed to complete Google verification.");
		});
	}, [navigate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-screen flex items-center justify-center p-4 font-hand",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "notebook relative max-w-md w-full p-6 sm:p-8 rounded shadow-2xl text-center space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "tape absolute -top-3 left-1/2 h-6 w-32 -translate-x-1/2 rotate-[-1deg]" }),
				status === "loading" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 py-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-10 w-10 animate-spin text-accent mx-auto" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl font-display text-foreground font-bold",
							children: "Verifying Google Credentials... 🕵️"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Please wait while we log you into Imposter World and unlock your dossier."
						})
					]
				}),
				status === "success" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 py-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-4xl",
							children: "✅"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl font-display text-emerald-700 font-bold",
							children: "Verified Successfully!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Redirecting to classroom dashboard..."
						})
					]
				}),
				status === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sketch bg-rose-50 border border-rose-300 p-4 rounded text-left space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-rose-700 font-bold text-base",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-5 w-5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Google Verification Failed" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-rose-900 font-sans",
								children: errorMessage
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-muted-foreground pt-1 border-t border-rose-200",
								children: [
									"Note: In Google Cloud Console Testing mode, your email must be added to ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Test Users" }),
									" on the OAuth consent screen."
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => window.location.href = "/",
						className: "sketch w-full bg-secondary py-2 text-sm font-bold text-foreground hover:bg-secondary/80 flex items-center justify-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Return to Classroom"]
					})]
				})
			]
		})
	});
}
//#endregion
export { GoogleCallbackPage as component };
