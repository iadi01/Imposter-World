import { o as __toESM } from "../_runtime.mjs";
import { t as API_BASE } from "./api-OZfBBcXI.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { $ as CircleCheck, K as ExternalLink, S as QrCode, Y as Copy, _ as Send, c as TriangleAlert, f as Smartphone, m as ShieldCheck, nt as Check, ot as ArrowLeft, t as X } from "../_libs/lucide-react.mjs";
import { t as require_lib } from "../_libs/qrcode.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/support-BtL_Iw9Y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var import_lib = /* @__PURE__ */ __toESM(require_lib());
var _jsxFileName = "/Users/aadi/Downloads/f8225c15-5378-482e-bfe4-be001f84d384/src/routes/support.tsx?tsr-split=component";
var UPI_ID = "iadi0@ptyes";
var PAYEE_NAME = "Aditya Sharma";
var DEV_NAME = "Aditya Sharma · Website Developer";
var TIERS = [
	{
		amount: 11,
		label: "Shagun",
		icon: "🪙"
	},
	{
		amount: 21,
		label: "Ice Cream",
		icon: "🍦"
	},
	{
		amount: 51,
		label: "Chai & Samosa",
		icon: "🫖"
	},
	{
		amount: 101,
		label: "Double Espresso",
		icon: "☕"
	},
	{
		amount: 251,
		label: "Server Fuel",
		icon: "⚡"
	},
	{
		amount: 501,
		label: "Code Supercharger",
		icon: "🚀"
	},
	{
		amount: 1001,
		label: "Guardian Patron",
		icon: "🛡️"
	},
	{
		amount: 2501,
		label: "Founding Legend",
		icon: "💎"
	},
	{
		amount: 9999,
		label: "Classroom Legend",
		icon: "👑"
	}
];
function buildUpiUri(amount) {
	return `upi://pay?${new URLSearchParams({
		pa: UPI_ID,
		pn: PAYEE_NAME,
		am: String(amount),
		cu: "INR"
	}).toString()}`;
}
function UpiQr({ amount }) {
	const [dataUrl, setDataUrl] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		import_lib.toDataURL(buildUpiUri(amount), {
			errorCorrectionLevel: "M",
			margin: 1,
			width: 512,
			color: {
				dark: "#1a120b",
				light: "#fef9ee"
			}
		}).then((url) => {
			if (!cancelled) setDataUrl(url);
		}).catch(() => {});
		return () => {
			cancelled = true;
		};
	}, [amount]);
	if (!dataUrl) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-full aspect-square bg-muted/30 animate-pulse rounded" }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 92,
		columnNumber: 12
	}, this);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
		src: dataUrl,
		alt: `UPI QR for ₹${amount}`,
		className: "w-full h-full object-contain rounded"
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 94,
		columnNumber: 10
	}, this);
}
function SupportPage() {
	const [selectedAmount, setSelectedAmount] = (0, import_react.useState)(501);
	const [customAmount, setCustomAmount] = (0, import_react.useState)("");
	const [paymentMode, setPaymentMode] = (0, import_react.useState)("QR");
	const [supporterName, setSupporterName] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	const [showAmountPublicly, setShowAmountPublicly] = (0, import_react.useState)(true);
	const [submitted, setSubmitted] = (0, import_react.useState)(false);
	const [supporters, setSupporters] = (0, import_react.useState)([]);
	const [wallPage, setWallPage] = (0, import_react.useState)(0);
	const [copiedUpi, setCopiedUpi] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		fetch(`${API_BASE}/api/auth/me`, { credentials: "include" }).then((r) => r.json()).then((d) => {
			if (d && d.user && d.user.displayName) setSupporterName((prev) => prev || d.user.displayName);
		}).catch(() => {});
	}, []);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		fetch(`${API_BASE}/api/supporters`).then((r) => r.json()).then((data) => {
			if (cancelled) return;
			if (data && data.success && Array.isArray(data.supporters)) setSupporters(data.supporters);
		}).catch(() => {});
		return () => {
			cancelled = true;
		};
	}, []);
	const activeAmount = customAmount ? Math.max(1, parseInt(customAmount, 10) || 0) : selectedAmount;
	const displayAmount = `₹${activeAmount.toLocaleString("en-IN")}`;
	const upiUri = buildUpiUri(activeAmount);
	const onSubmit = async (e) => {
		e.preventDefault();
		if (!supporterName.trim()) {
			toast.error("Please enter your name.");
			return;
		}
		try {
			const data = await (await fetch(`${API_BASE}/api/supporters`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: supporterName.trim(),
					amount: activeAmount,
					message: message.trim(),
					showAmount: showAmountPublicly
				})
			})).json();
			setSubmitted(true);
			if (data && data.success) toast.success(`Thank you ${supporterName}! Your submission has been received for admin verification.`);
			else toast.success(`Thank you ${supporterName}! Details logged.`);
		} catch {
			setSubmitted(true);
			toast.success(`Thank you ${supporterName}! Details logged.`);
		}
	};
	const copyUpi = async () => {
		try {
			await navigator.clipboard.writeText(UPI_ID);
			setCopiedUpi(true);
			setTimeout(() => setCopiedUpi(false), 2e3);
			toast.success("UPI ID copied to clipboard!");
		} catch {
			toast.error("Could not copy — please copy manually: iadi0@ptyes");
		}
	};
	const copyLink = async () => {
		try {
			await navigator.clipboard.writeText(upiUri);
			toast.success("UPI payment link copied.");
		} catch {
			toast.error("Could not copy link.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
		className: "min-h-screen px-3 py-6 md:px-8 md:py-10",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mx-auto max-w-4xl space-y-6",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", {
				className: "flex items-center gap-2 text-sm font-hand text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: "/",
						className: "text-primary hover:underline flex items-center gap-1 font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowLeft, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 189,
							columnNumber: 13
						}, this), " Home"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 188,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "/" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 191,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-foreground font-bold",
						children: "Support the Developer"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 192,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 187,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", {
				className: "notebook relative p-4 sm:p-8 md:p-10 shadow-lg space-y-10 font-hand text-foreground leading-relaxed",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "tape absolute -top-3 left-1/2 h-6 w-36 -translate-x-1/2 rotate-[-1deg]" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 197,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
						className: "border-b-2 border-foreground/20 pb-6 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "inline-block bg-highlight px-3 py-1 rounded-sm text-xs font-bold border border-foreground/30 uppercase tracking-wider",
									children: "Voluntary Developer Support"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 202,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-xs text-muted-foreground font-mono",
									children: "Effective 2026 · UPI India"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 205,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 201,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
								className: "text-4xl sm:text-5xl md:text-6xl font-display text-foreground font-bold tracking-tight",
								children: ["Support the ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "underline decoration-primary",
									children: "Developer ☕"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 210,
									columnNumber: 27
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 209,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-base sm:text-lg text-primary font-bold max-w-2xl",
								children: "Independent game development and maintenance for Imposter World. Voluntary support keeps the hosting active, the multiplayer WebSocket servers online 24/7, and classroom party gaming completely free for everyone."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 212,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 200,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "grid gap-8 lg:grid-cols-2 items-start",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
									className: "font-display text-2xl uppercase flex items-center gap-2 text-foreground font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "bg-primary text-primary-foreground px-2 py-0.5 rounded text-sm font-sans font-bold",
										children: "01"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 224,
										columnNumber: 17
									}, this), "Send Support"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 223,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "sketch bg-card/90 p-5 sm:p-6 space-y-5 border-2 border-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "border-b border-foreground/20 pb-3",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
												className: "font-display text-xl font-bold text-foreground",
												children: "Support Aditya Sharma"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 232,
												columnNumber: 19
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
												className: "text-xs text-muted-foreground mt-0.5",
												children: "Choose Your Support Contribution (INR)"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 235,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 231,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "grid grid-cols-3 gap-2",
											children: TIERS.map((opt) => {
												const active = selectedAmount === opt.amount && !customAmount;
												return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
													type: "button",
													onClick: () => {
														setSelectedAmount(opt.amount);
														setCustomAmount("");
													},
													className: `flex flex-col items-start p-2 rounded border-2 transition text-left cursor-pointer ${active ? "border-primary bg-highlight/80 shadow-[2px_2px_0_0_rgba(0,0,0,1)] scale-[1.02]" : "border-foreground/30 bg-white/70 hover:border-foreground"}`,
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
														className: "font-display text-sm sm:text-base font-bold text-foreground leading-tight",
														children: [
															/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
																className: "mr-1",
																children: opt.icon
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 249,
																columnNumber: 27
															}, this),
															"₹",
															opt.amount
														]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 248,
														columnNumber: 25
													}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
														className: "text-[10px] sm:text-xs text-muted-foreground truncate w-full",
														children: opt.label
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 251,
														columnNumber: 25
													}, this)]
												}, opt.amount, true, {
													fileName: _jsxFileName,
													lineNumber: 244,
													columnNumber: 26
												}, this);
											})
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 241,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
											className: "block text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider",
											children: "Or Enter Custom Amount (INR)"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 260,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "relative",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "absolute left-3 top-1/2 -translate-y-1/2 font-display text-lg font-bold text-foreground",
												children: "₹"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 264,
												columnNumber: 21
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
												type: "number",
												min: 1,
												value: customAmount,
												onChange: (e) => {
													const v = parseInt(e.target.value, 10);
													setCustomAmount(isNaN(v) || v < 0 ? "" : String(v));
												},
												placeholder: "e.g. 500",
												className: "w-full bg-white/90 border-2 border-foreground/40 pl-8 pr-3 py-2 text-sm font-hand rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-bold"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 267,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 263,
											columnNumber: 19
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 259,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider",
											children: "Payment Channel"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 276,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "grid grid-cols-2 gap-2",
											children: ["QR", "UPI"].map((mode) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
												type: "button",
												onClick: () => setPaymentMode(mode),
												className: `py-2 px-3 border-2 font-display text-sm font-bold uppercase tracking-wider transition-colors rounded flex items-center justify-center gap-1.5 cursor-pointer ${paymentMode === mode ? "border-foreground bg-primary text-primary-foreground shadow-[2px_2px_0_0_rgba(0,0,0,1)]" : "border-foreground/30 bg-white/80 text-foreground hover:border-foreground"}`,
												children: mode === "UPI" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Smartphone, { className: "h-4 w-4" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 282,
													columnNumber: 29
												}, this), " UPI ID (India)"] }, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 281,
													columnNumber: 43
												}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(QrCode, { className: "h-4 w-4" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 284,
													columnNumber: 29
												}, this), " Scan QR Code"] }, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 283,
													columnNumber: 33
												}, this)
											}, mode, false, {
												fileName: _jsxFileName,
												lineNumber: 280,
												columnNumber: 59
											}, this))
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 279,
											columnNumber: 19
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 275,
											columnNumber: 17
										}, this),
										paymentMode === "UPI" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "border-2 border-foreground bg-white/90 p-4 rounded space-y-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "text-xs font-bold text-accent uppercase tracking-wider",
													children: ["Pay to UPI · ", displayAmount]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 292,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "font-display text-2xl font-bold select-all break-all text-foreground bg-highlight/30 p-2 rounded border border-foreground/20",
													children: UPI_ID
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 295,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "text-xs text-muted-foreground font-bold",
													children: DEV_NAME
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 298,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "grid grid-cols-2 gap-2 pt-1",
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
														type: "button",
														onClick: copyUpi,
														className: "bg-primary text-primary-foreground py-2.5 px-3 rounded font-display uppercase tracking-wider text-xs font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-[2px_2px_0_0_rgba(0,0,0,1)]",
														children: [copiedUpi ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, { className: "h-3.5 w-3.5" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 301,
															columnNumber: 38
														}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Copy, { className: "h-3.5 w-3.5" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 301,
															columnNumber: 74
														}, this), copiedUpi ? "Copied!" : "Copy UPI ID"]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 300,
														columnNumber: 23
													}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
														href: upiUri,
														className: "border-2 border-foreground bg-white text-foreground py-2.5 px-3 rounded font-display uppercase tracking-wider text-xs font-bold hover:bg-foreground hover:text-white transition-colors text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-[2px_2px_0_0_rgba(0,0,0,1)]",
														children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ExternalLink, { className: "h-3.5 w-3.5" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 305,
															columnNumber: 25
														}, this), " Open in UPI App"]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 304,
														columnNumber: 23
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 299,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
													type: "button",
													onClick: copyLink,
													className: "w-full text-[11px] text-muted-foreground hover:text-primary text-left break-all underline cursor-pointer mt-1",
													children: upiUri
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 308,
													columnNumber: 21
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 291,
											columnNumber: 42
										}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "border-2 border-foreground bg-white/90 p-4 text-center space-y-3 rounded",
											children: [
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "text-xs font-bold text-accent uppercase tracking-wider",
													children: ["Scan to Pay ", displayAmount]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 312,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "mx-auto w-52 h-52 sm:w-56 sm:h-56 border-2 border-foreground bg-white p-2 rounded shadow-inner",
													children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(UpiQr, { amount: activeAmount }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 316,
														columnNumber: 23
													}, this)
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 315,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "text-xs font-bold text-muted-foreground",
													children: "PhonePe · GPay · Paytm · BHIM UPI"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 318,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "text-xs",
													children: [
														"Paying to ",
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
															className: "text-foreground font-bold",
															children: PAYEE_NAME
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 322,
															columnNumber: 33
														}, this),
														" ·",
														" ",
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
															className: "font-mono select-all font-bold text-primary",
															children: UPI_ID
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 323,
															columnNumber: 23
														}, this)
													]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 321,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
													href: upiUri,
													className: "inline-flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground py-2.5 rounded font-display uppercase tracking-wider text-xs font-bold hover:bg-primary/90 transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)]",
													children: [
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Smartphone, { className: "h-4 w-4" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 326,
															columnNumber: 23
														}, this),
														" Open UPI App · ",
														displayAmount
													]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 325,
													columnNumber: 21
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 311,
											columnNumber: 28
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "border border-accent/40 bg-accent/10 p-3 rounded text-xs text-foreground leading-relaxed flex items-start gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TriangleAlert, { className: "h-4 w-4 text-accent shrink-0 mt-0.5" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 332,
												columnNumber: 19
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "font-bold text-accent",
													children: "If your UPI app shows a warning:"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 334,
													columnNumber: 21
												}, this),
												" ",
												"Some banking apps show ",
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("em", { children: "\"This payment may fail as per UPI risk policy\"" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 335,
													columnNumber: 44
												}, this),
												" for newer merchant VPA handles. To pay safely, scan the QR code directly inside Google Pay, PhonePe, or Paytm, or enter the UPI ID",
												" ",
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "font-bold underline",
													children: UPI_ID
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 338,
													columnNumber: 21
												}, this),
												" manually."
											] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 333,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 331,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 230,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
									className: "sketch bg-highlight/30 p-4 sm:p-5 border border-foreground/40 space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center gap-2 font-display text-lg font-bold text-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldCheck, { className: "h-5 w-5 text-primary" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 346,
											columnNumber: 19
										}, this), " Important Notice"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 345,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
										className: "text-xs text-muted-foreground space-y-1 list-disc list-inside",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Payments go directly to the independent website developer." }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 349,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Funds cover servers, domains, and site maintenance only." }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 350,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Not eligible for Section 80G tax deduction." }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 351,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "No refunds — voluntary support contribution only." }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 352,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "All infrastructure costs are publicly disclosed below." }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 353,
												columnNumber: 19
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 348,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 344,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 222,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
								className: "font-display text-2xl uppercase flex items-center gap-2 text-foreground font-bold",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "bg-primary text-primary-foreground px-2 py-0.5 rounded text-sm font-sans font-bold",
									children: "02"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 361,
									columnNumber: 17
								}, this), "Join The Supporter Wall"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 360,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "sketch bg-card/90 p-5 sm:p-6 border-2 border-foreground space-y-4",
								children: submitted ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "border-2 border-primary bg-primary/10 p-6 text-center space-y-2 rounded",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "font-display text-2xl font-bold text-primary",
											children: [
												"Thank you, ",
												supporterName,
												"! 🎉"
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 369,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "text-sm text-foreground",
											children: [
												"Your contribution of ",
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: displayAmount }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 373,
													columnNumber: 44
												}, this),
												" has been submitted. Once verified by the admin, your name and message will appear on the Supporter Wall below."
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 372,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded border border-amber-300 mt-1",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "⏳ Status: Pending Admin Verification" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 377,
												columnNumber: 23
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 376,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
											type: "button",
											onClick: () => {
												setSubmitted(false);
												setMessage("");
											},
											className: "mt-3 text-xs font-bold text-primary hover:underline cursor-pointer",
											children: "Submit another message →"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 380,
											columnNumber: 23
										}, this) }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 379,
											columnNumber: 21
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 368,
									columnNumber: 30
								}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
									onSubmit,
									className: "space-y-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center justify-between border-b border-foreground/20 pb-2 text-xs font-bold",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-muted-foreground uppercase tracking-wider",
												children: "Public Wall · Optional"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 389,
												columnNumber: 23
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-accent text-sm font-display font-bold",
												children: displayAmount
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 392,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 388,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
											className: "block text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider",
											children: "Your Name"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 398,
											columnNumber: 23
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
											type: "text",
											value: supporterName,
											onChange: (e) => setSupporterName(e.target.value.slice(0, 100)),
											placeholder: "e.g. Aditya Sharma",
											className: "w-full bg-white/90 border-2 border-foreground/30 px-3 py-2 text-sm font-hand rounded focus:outline-none focus:border-primary font-bold"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 401,
											columnNumber: 23
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 397,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
												className: "block text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider",
												children: "Message for the Developer"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 405,
												columnNumber: 23
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("textarea", {
												rows: 4,
												value: message,
												onChange: (e) => setMessage(e.target.value.slice(0, 500)),
												placeholder: "Say something nice, suggest a game mode, or send chai love...",
												className: "w-full bg-white/90 border-2 border-foreground/30 p-3 text-sm font-hand rounded focus:outline-none focus:border-primary resize-none"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 408,
												columnNumber: 23
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "text-[11px] text-muted-foreground text-right mt-0.5",
												children: [message.length, "/500"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 409,
												columnNumber: 23
											}, this)
										] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 404,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center gap-2 pt-1",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
												type: "checkbox",
												id: "showAmountCheck",
												checked: showAmountPublicly,
												onChange: (e) => setShowAmountPublicly(e.target.checked),
												className: "rounded border-foreground text-primary focus:ring-primary h-4 w-4"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 415,
												columnNumber: 23
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
												htmlFor: "showAmountCheck",
												className: "text-xs text-muted-foreground font-bold cursor-pointer",
												children: [
													"Display contribution amount (",
													displayAmount,
													") on the wall publicly"
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 416,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 414,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
											type: "submit",
											className: "w-full bg-foreground text-card py-3 rounded font-display uppercase tracking-wider text-sm font-bold hover:bg-primary transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-[2px_2px_0_0_rgba(0,0,0,1)] mt-2",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Send, { className: "h-4 w-4" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 422,
												columnNumber: 23
											}, this), " Submit Support Details →"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 421,
											columnNumber: 21
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 387,
									columnNumber: 28
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 367,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 359,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 220,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
						id: "wall",
						className: "space-y-5 pt-4 border-t-2 border-foreground/20",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "border-b border-foreground/20 pb-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-xs font-bold text-accent uppercase tracking-wider",
									children: "Supporter Wall"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 432,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
									className: "text-3xl sm:text-4xl font-display font-bold text-foreground mt-1",
									children: ["The Chai That Keeps The ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-primary",
										children: "Lights On 💡"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 436,
										columnNumber: 41
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 435,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-xs sm:text-sm text-muted-foreground max-w-2xl mt-1",
									children: "Supporters helping cover game server costs, hosting, and domain upkeep. Amounts can be private or public — recognition is a thank-you, never an ad."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 438,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 431,
							columnNumber: 13
						}, this), supporters.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "border-2 border-dashed border-foreground/30 bg-white/60 p-8 sm:p-12 text-center rounded space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "font-display text-4xl text-muted-foreground/40 font-bold",
									children: "0"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 445,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "font-display text-lg font-bold text-foreground",
									children: "Zero verified supporters so far"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 446,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-xs text-muted-foreground max-w-sm mx-auto",
									children: "The wall is waiting! Send any amount above and add your name to be the very first patron on the leaderboard."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 449,
									columnNumber: 17
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 444,
							columnNumber: 40
						}, this) : (() => {
							const PAGE_SIZE = 9;
							const totalPages = Math.max(1, Math.ceil(supporters.length / PAGE_SIZE));
							const page = Math.min(wallPage, totalPages - 1);
							const slice = supporters.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
							const timeAgo = (iso) => {
								const diff = Date.now() - new Date(iso).getTime();
								const h = Math.floor(diff / 36e5);
								if (h < 1) return "JUST NOW";
								if (h < 24) return `${h} HOUR${h === 1 ? "" : "S"} AGO`;
								const d = Math.floor(h / 24);
								if (d === 1) return "YESTERDAY";
								if (d < 30) return `${d} DAYS AGO`;
								return new Date(iso).toLocaleDateString("en-IN", {
									day: "2-digit",
									month: "short",
									year: "numeric"
								}).toUpperCase();
							};
							return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-3",
									children: slice.map((s) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "sketch bg-card/90 p-4 border border-foreground/40 shadow-[3px_3px_0_0_rgba(0,0,0,1)] flex flex-col justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-start gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "w-10 h-10 shrink-0 border-2 border-foreground bg-highlight flex items-center justify-center font-display text-lg font-bold rounded",
												children: (s.name || "?").trim().charAt(0).toUpperCase()
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 477,
												columnNumber: 31
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "min-w-0 flex-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
														className: "font-display text-base font-bold truncate text-foreground",
														children: s.name
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 481,
														columnNumber: 33
													}, this),
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
														className: "flex items-center gap-1 text-[11px] text-primary font-bold",
														children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "h-3 w-3 text-primary shrink-0" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 485,
															columnNumber: 35
														}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Verified Supporter" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 486,
															columnNumber: 35
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 484,
														columnNumber: 33
													}, this),
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
														className: "text-[10px] text-muted-foreground",
														children: timeAgo(s.paid_at)
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 488,
														columnNumber: 33
													}, this)
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 480,
												columnNumber: 31
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 476,
											columnNumber: 29
										}, this), s.message && /* @__PURE__ */ (void 0)("div", {
											className: "mt-3 pl-2.5 border-l-2 border-primary text-xs italic text-foreground/80 break-words",
											children: [
												"\"",
												s.message,
												"\""
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 494,
											columnNumber: 43
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 475,
											columnNumber: 27
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "mt-3 pt-3 border-t border-foreground/15 flex items-center justify-between text-xs font-bold",
											children: [s.show_amount && Number(s.amount) > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "bg-highlight px-2 py-0.5 rounded border border-foreground/20 text-foreground font-display",
												children: ["₹", Number(s.amount).toLocaleString("en-IN")]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 500,
												columnNumber: 70
											}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-muted-foreground text-[11px] font-mono",
												children: "₹•••• (Private)"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 502,
												columnNumber: 41
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-[10px] text-muted-foreground uppercase",
												children: "Supporter"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 505,
												columnNumber: 29
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 499,
											columnNumber: 27
										}, this)]
									}, s.id, true, {
										fileName: _jsxFileName,
										lineNumber: 474,
										columnNumber: 39
									}, this))
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 473,
									columnNumber: 21
								}, this), totalPages > 1 && /* @__PURE__ */ (void 0)("div", {
									className: "flex items-center justify-center gap-3 pt-2",
									children: [
										/* @__PURE__ */ (void 0)("button", {
											type: "button",
											onClick: () => setWallPage((p) => Math.max(0, p - 1)),
											disabled: page === 0,
											className: "border border-foreground px-3 py-1.5 rounded font-display text-xs uppercase tracking-wider hover:bg-foreground hover:text-white disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer",
											children: "← Prev"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 513,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (void 0)("span", {
											className: "text-xs text-muted-foreground font-bold",
											children: [
												"Page ",
												page + 1,
												" of ",
												totalPages
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 516,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (void 0)("button", {
											type: "button",
											onClick: () => setWallPage((p) => Math.min(totalPages - 1, p + 1)),
											disabled: page >= totalPages - 1,
											className: "border border-foreground px-3 py-1.5 rounded font-display text-xs uppercase tracking-wider hover:bg-foreground hover:text-white disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer",
											children: "Next →"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 519,
											columnNumber: 25
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 512,
									columnNumber: 40
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 472,
								columnNumber: 20
							}, this);
						})()]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 430,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
						className: "space-y-3 pt-4 border-t-2 border-foreground/20",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
								className: "font-display text-2xl uppercase border-b border-foreground/20 pb-2 text-foreground font-bold",
								children: [
									"What Your Support Does ",
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-accent",
										children: "NOT"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 530,
										columnNumber: 38
									}, this),
									" Provide"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 529,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs sm:text-sm text-muted-foreground max-w-2xl",
								children: "Supporting the developer is a friendly thank-you, not an in-game purchase. To keep Imposter World 100% fair, transparent, and fun for all players, your voluntary support does not provide:"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 532,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs pt-1",
								children: [
									"Guaranteed Detective or Imposter role",
									"Secret word peek or clue leak cheats",
									"Unfair gameplay advantages or powerups",
									"Pay-to-win leaderboard rank boosts",
									"Room kick/ban moderation immunity",
									"Commercial ads or sponsor banners",
									"Game ownership or rule influence",
									"Compulsory paid features (100% free to play)"
								].map((x) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "p-2.5 border border-foreground/25 bg-white/70 rounded flex items-center gap-2 font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { className: "h-3.5 w-3.5 text-accent shrink-0 font-bold" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 537,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-foreground",
										children: x
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 538,
										columnNumber: 19
									}, this)]
								}, x, true, {
									fileName: _jsxFileName,
									lineNumber: 536,
									columnNumber: 345
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 535,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 528,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
						className: "sketch bg-card/90 p-5 sm:p-7 border border-foreground/40 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
								className: "font-display text-xl uppercase font-bold text-foreground border-b border-foreground/20 pb-2",
								children: "Financial & Legal Notice"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 545,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs sm:text-sm text-foreground/80 leading-relaxed",
								children: "All payments made through this page are received directly by:"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 548,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "p-3 border border-foreground/30 bg-white/90 rounded",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "font-display text-xl font-bold text-foreground",
									children: PAYEE_NAME
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 552,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-xs text-muted-foreground font-bold",
									children: "Independent Website & Game Developer"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 553,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 551,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-xs font-bold text-muted-foreground uppercase tracking-wider",
									children: "Accepted Payment Channels"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 559,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
									className: "list-disc list-inside text-xs text-foreground/80",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "UPI (India) — GPay, PhonePe, Paytm, BHIM" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 563,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 562,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 558,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-xs font-bold text-muted-foreground uppercase tracking-wider",
									children: "Purpose of Voluntary Support Payments"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 568,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
									className: "grid sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-foreground/80 list-disc list-inside",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Website development" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 572,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Website maintenance" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 573,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Hosting & servers" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 574,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Domain renewals" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 575,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Infrastructure" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 576,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Security improvements" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 577,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Performance optimizations" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 578,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "New game modes & features" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 579,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 571,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 567,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs text-muted-foreground leading-relaxed pt-2",
								children: "These voluntary support payments are intended solely to cover the costs of developing and maintaining this website. This page does not collect payments on behalf of any registered political party, election campaign, charitable trust, NGO, or other organization."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 583,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "grid sm:grid-cols-2 gap-2 pt-2 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "p-3 border border-foreground/20 bg-white/70 rounded",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "font-display text-sm font-bold block text-foreground",
										children: "No Tax Benefit"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 592,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-muted-foreground mt-0.5 block text-[11px]",
										children: "Voluntary payments are not eligible for tax deductions under Section 80G."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 595,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 591,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "p-3 border border-foreground/20 bg-white/70 rounded",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "font-display text-sm font-bold block text-foreground",
										children: "No GST"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 600,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-muted-foreground mt-0.5 block text-[11px]",
										children: "No GST invoice is issued for voluntary personal support contributions."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 601,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 599,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 590,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 544,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
						className: "space-y-3 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "font-display text-2xl uppercase border-b border-foreground/20 pb-2 text-foreground font-bold",
							children: "Frequently Asked Questions"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 610,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "divide-y divide-foreground/20 border border-foreground/30 bg-white/70 rounded overflow-hidden",
							children: [
								{
									q: "Is this a political donation?",
									a: "No. This is a voluntary contribution to the independent website developer to cover hosting, multiplayer servers, and maintenance."
								},
								{
									q: "Is this a registered political party?",
									a: "No. Imposter World is an independent educational party game project, not a political party or commercial enterprise."
								},
								{
									q: "Is this a charity or NGO?",
									a: "No. Payments are personal voluntary support to the creator and are not collected on behalf of any trust or NGO."
								},
								{
									q: "Who receives the payment?",
									a: `${PAYEE_NAME} — the independent website and game developer.`
								},
								{
									q: "Will I become a member?",
									a: "No. Support does not grant party membership, voting rights, or special administrative privileges."
								},
								{
									q: "What am I supporting?",
									a: "Multiplayer WebSocket servers, database maintenance, cloud domain costs, and new game features."
								},
								{
									q: "Is payment required to play?",
									a: "No! Imposter World is 100% free to play with your friends, classmates, and family."
								},
								{
									q: "Will I receive anything in return?",
									a: "No goods or services. Optionally, your name appears on the public Supporter Wall as a token of gratitude."
								},
								{
									q: "Can businesses sponsor or advertise?",
									a: "No. This website is ad-free and does not host commercial sponsorships."
								},
								{
									q: "Can I contribute from outside India?",
									a: "Currently only UPI (India) is enabled. International channels may be added later."
								},
								{
									q: "Is this tax deductible?",
									a: "No. Voluntary support payments are not eligible for Section 80G or any similar tax rebate."
								},
								{
									q: "Can I request removal from the Supporter Wall?",
									a: "Yes. Drop an email to hello@imposterworld.xyz with your name and we will happily remove your entry."
								}
							].map((f) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("details", {
								className: "group p-3 sm:p-4",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("summary", {
									className: "flex items-center justify-between cursor-pointer list-none font-bold text-foreground text-sm sm:text-base",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: f.q }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 652,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-primary font-display text-xl group-open:rotate-45 transition-transform",
										children: "+"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 653,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 651,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed",
									children: f.a
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 657,
									columnNumber: 19
								}, this)]
							}, f.q, true, {
								fileName: _jsxFileName,
								lineNumber: 650,
								columnNumber: 25
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 613,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 609,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
						className: "grid md:grid-cols-2 gap-4 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "sketch bg-white/70 p-4 border border-foreground/30 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "font-display text-lg font-bold uppercase text-foreground border-b border-foreground/20 pb-1",
								children: "Support Policy"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 667,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-xs text-muted-foreground space-y-1.5 leading-relaxed",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "Supporting the developer is completely optional. Imposter World remains freely accessible whether or not you choose to contribute." }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 671,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "Voluntary support payments are used solely for game development, hosting, domains, infrastructure, security, and future gameplay improvements." }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 675,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: [
										"Please verify the payee name ",
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: PAYEE_NAME }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 680,
											columnNumber: 48
										}, this),
										" in your UPI app before confirming payment."
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 679,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 670,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 666,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "sketch bg-white/70 p-4 border border-foreground/30 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "font-display text-lg font-bold uppercase text-foreground border-b border-foreground/20 pb-1",
								children: "Refund Policy"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 687,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-xs text-muted-foreground space-y-1.5 leading-relaxed",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "Support contributions are voluntary gifts and are generally non-refundable." }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 691,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: [
									"If you made an accidental payment or wrong amount, contact the developer within 7 days at",
									" ",
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
										href: "mailto:hello@imposterworld.xyz",
										className: "text-primary underline font-bold",
										children: "hello@imposterworld.xyz"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 697,
										columnNumber: 19
									}, this),
									" ",
									"with your UPI transaction ID (UTR)."
								] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 694,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 690,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 686,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 665,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("footer", {
						className: "border-t-2 border-foreground/20 pt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-xs sm:text-sm font-bold text-primary",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/",
								className: "hover:underline hover:text-accent",
								children: "Play Imposter World"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 708,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-muted-foreground/60",
								children: "·"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 711,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/how-to-play",
								className: "hover:underline hover:text-accent",
								children: "How To Play Imposter World"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 712,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-muted-foreground/60",
								children: "·"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 715,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/articles",
								className: "hover:underline hover:text-accent",
								children: "Game Strategy Articles"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 716,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-muted-foreground/60",
								children: "·"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 719,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/notice-board",
								className: "hover:underline hover:text-accent",
								children: "Notice Board"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 720,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-muted-foreground/60",
								children: "·"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 723,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/support",
								className: "hover:underline hover:text-accent text-accent",
								children: "Support the Dev"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 724,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-muted-foreground/60",
								children: "·"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 727,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/terms",
								className: "hover:underline hover:text-accent",
								children: "Terms of Use"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 728,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-muted-foreground/60",
								children: "·"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 731,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/privacy",
								className: "hover:underline hover:text-accent",
								children: "Privacy Policy"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 732,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-muted-foreground/60",
								children: "·"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 735,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/delete-account",
								className: "hover:underline hover:text-accent",
								children: "Delete Account"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 736,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 707,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 196,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 185,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 184,
		columnNumber: 10
	}, this);
}
//#endregion
export { SupportPage as component };
