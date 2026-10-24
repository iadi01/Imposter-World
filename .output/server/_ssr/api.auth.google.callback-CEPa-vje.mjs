import { o as __toESM } from "../_runtime.mjs";
import { t as API_BASE } from "./api-OZfBBcXI.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { I as LoaderCircle, et as CircleAlert, ot as ArrowLeft } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api.auth.google.callback-CEPa-vje.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/Users/aadi/Downloads/f8225c15-5378-482e-bfe4-be001f84d384/src/routes/api.auth.google.callback.tsx?tsr-split=component";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
		className: "min-h-screen flex items-center justify-center p-4 font-hand",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "notebook relative max-w-md w-full p-6 sm:p-8 rounded shadow-2xl text-center space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "tape absolute -top-3 left-1/2 h-6 w-32 -translate-x-1/2 rotate-[-1deg]" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 53,
					columnNumber: 9
				}, this),
				status === "loading" && /* @__PURE__ */ (void 0)("div", {
					className: "space-y-3 py-6",
					children: [
						/* @__PURE__ */ (void 0)(LoaderCircle, { className: "h-10 w-10 animate-spin text-accent mx-auto" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 56,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("h2", {
							className: "text-2xl font-display text-foreground font-bold",
							children: "Verifying Google Credentials... 🕵️"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 57,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("p", {
							className: "text-sm text-muted-foreground",
							children: "Please wait while we log you into Imposter World and unlock your dossier."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 60,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 55,
					columnNumber: 34
				}, this),
				status === "success" && /* @__PURE__ */ (void 0)("div", {
					className: "space-y-3 py-6",
					children: [
						/* @__PURE__ */ (void 0)("div", {
							className: "text-4xl",
							children: "✅"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 66,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("h2", {
							className: "text-2xl font-display text-emerald-700 font-bold",
							children: "Verified Successfully!"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 67,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("p", {
							className: "text-sm text-muted-foreground",
							children: "Redirecting to classroom dashboard..."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 70,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 65,
					columnNumber: 34
				}, this),
				status === "error" && /* @__PURE__ */ (void 0)("div", {
					className: "space-y-4 py-4",
					children: [/* @__PURE__ */ (void 0)("div", {
						className: "sketch bg-rose-50 border border-rose-300 p-4 rounded text-left space-y-2",
						children: [
							/* @__PURE__ */ (void 0)("div", {
								className: "flex items-center gap-2 text-rose-700 font-bold text-base",
								children: [/* @__PURE__ */ (void 0)(CircleAlert, { className: "h-5 w-5 shrink-0" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 76,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("span", { children: "Google Verification Failed" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 77,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 75,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("p", {
								className: "text-xs text-rose-900 font-sans",
								children: errorMessage
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 79,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "text-[11px] text-muted-foreground pt-1 border-t border-rose-200",
								children: [
									"Note: In Google Cloud Console Testing mode, your email must be added to ",
									/* @__PURE__ */ (void 0)("strong", { children: "Test Users" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 81,
										columnNumber: 89
									}, this),
									" on the OAuth consent screen."
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 80,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 74,
						columnNumber: 13
					}, this), /* @__PURE__ */ (void 0)("button", {
						onClick: () => window.location.href = "/",
						className: "sketch w-full bg-secondary py-2 text-sm font-bold text-foreground hover:bg-secondary/80 flex items-center justify-center gap-1.5",
						children: [/* @__PURE__ */ (void 0)(ArrowLeft, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 86,
							columnNumber: 15
						}, this), " Return to Classroom"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 85,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 73,
					columnNumber: 32
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 52,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 51,
		columnNumber: 10
	}, this);
}
//#endregion
export { GoogleCallbackPage as component };
