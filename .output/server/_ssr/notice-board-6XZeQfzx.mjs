import { o as __toESM } from "../_runtime.mjs";
import { t as API_BASE } from "./api-6A2QlK4P.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { j as Mic, nt as ArrowLeft, p as Shield, s as Trophy } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notice-board-6XZeQfzx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/Users/aadi/Downloads/f8225c15-5378-482e-bfe4-be001f84d384/src/routes/notice-board.tsx?tsr-split=component";
function NoticeBoardPage() {
	const [championName, setChampionName] = (0, import_react.useState)("Loading...");
	(0, import_react.useEffect)(() => {
		fetch(`${API_BASE}/api/leaderboard/champion`).then((r) => r.json()).then((d) => {
			if (d && d.success && d.champion) setChampionName(d.champion.name);
			else setChampionName("Top Detective");
		}).catch(() => {
			setChampionName("Top Detective");
		});
	}, []);
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
							lineNumber: 23,
							columnNumber: 13
						}, this), " Home"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 22,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "/" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 25,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-foreground font-bold",
						children: "Notice Board"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 26,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 21,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", {
				className: "notebook relative p-6 sm:p-10 shadow-lg space-y-6 font-hand text-foreground leading-relaxed",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "tape absolute -top-3 left-1/2 h-6 w-36 -translate-x-1/2 rotate-[-1deg]" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 31,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
						className: "border-b-2 border-foreground/20 pb-4 space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "inline-block bg-highlight px-2.5 py-0.5 rounded text-xs font-bold border border-foreground/30",
								children: "📌 Official Bulletins"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 34,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
								className: "text-4xl sm:text-5xl font-display text-foreground font-bold flex items-center gap-2",
								children: "Classroom Notice Board"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 37,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-lg text-primary font-bold",
								children: "Class announcements, patch updates, and competitive tournament notices."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 40,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs text-muted-foreground",
								children: "Pinned by Classroom Monitors: Adi & Shreya · Last updated 21 October 2026"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 43,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 33,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "sketch bg-[#EBF3FF] p-5 space-y-2 border-2 border-primary shadow-xs relative",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "tape absolute -top-2 left-6 h-4 w-20 rotate-[-2deg]" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 51,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center justify-between text-xs font-bold",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "bg-accent text-accent-foreground px-2 py-0.5 rounded",
											children: "TOURNAMENT"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 53,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-muted-foreground",
											children: "Every Wednesday"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 54,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 52,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
										className: "text-2xl font-display font-bold text-primary flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trophy, { className: "h-5 w-5 text-accent" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 57,
											columnNumber: 17
										}, this), " Tournament Desk 🏆"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 56,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Next one today (Wed):" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 60,
											columnNumber: 17
										}, this), " Top detectives clash in the 8-player bracket!"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 59,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "rounded bg-white/90 p-2.5 text-xs font-bold text-accent border border-accent/20",
										children: [
											"👑 ",
											championName,
											" currently holds the championship belt!"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 62,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 50,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "sketch bg-white/95 p-5 space-y-2 border-2 border-accent shadow-xs relative",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "tape absolute -top-2 left-6 h-4 w-20 rotate-[-3deg]" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 69,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center justify-between text-xs font-bold",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "bg-accent text-accent-foreground px-2 py-0.5 rounded",
											children: "NEW FEATURE"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 71,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-muted-foreground",
											children: "21 Oct 2026"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 72,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 70,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
										className: "text-2xl font-display font-bold text-foreground flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Mic, { className: "h-5 w-5 text-accent" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 75,
											columnNumber: 17
										}, this), " Live Voice Hints Now Active!"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 74,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-sm",
										children: [
											"Students can now speak their clues out loud! On your hint turn, tap ",
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "\"Voice Clue 🎙️\"" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 78,
												columnNumber: 85
											}, this),
											" to record a crisp audio clip or live speech transcript. Classmates can tap the audio cassette on the pinboard to listen to your clue in real-time."
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 77,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 68,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "sketch bg-white/90 p-5 space-y-2 border border-foreground/30 shadow-xs relative",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "tape absolute -top-2 left-6 h-4 w-20 rotate-[2deg]" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 84,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center justify-between text-xs font-bold",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "bg-primary text-primary-foreground px-2 py-0.5 rounded",
											children: "GAMEPLAY"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 86,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-muted-foreground",
											children: "20 Oct 2026"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 87,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 85,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
										className: "text-2xl font-display font-bold text-foreground",
										children: "🎨 Paint Bucket & Flood Fill in Drawing Pad"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 89,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-sm",
										children: "The drawing canvas now includes a fast flood-fill Paint Bucket tool with 1-click Undo! Color large areas of your sketch instantly to give faster and more expressive hints."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 92,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 83,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "sketch bg-white/90 p-5 space-y-2 border border-foreground/30 shadow-xs relative",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "tape absolute -top-2 left-6 h-4 w-20 rotate-[-1deg]" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 99,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center justify-between text-xs font-bold",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "bg-highlight px-2 py-0.5 rounded text-foreground font-bold border border-foreground/30",
											children: "RANKINGS"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 101,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-muted-foreground",
											children: "19 Oct 2026"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 102,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 100,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
										className: "text-2xl font-display font-bold text-foreground flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trophy, { className: "h-5 w-5 text-accent" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 105,
											columnNumber: 17
										}, this), " 3-Tier Leaderboards (Global, Country & State)"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 104,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-sm",
										children: "Compete against players worldwide, across India, or within your home state (Maharashtra, Delhi, Karnataka, etc.)! Track total wins, detective accuracy, and imposter survival rates."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 107,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 98,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "sketch bg-white/90 p-5 space-y-2 border border-foreground/30 shadow-xs relative",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "tape absolute -top-2 left-6 h-4 w-20 rotate-[1deg]" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 114,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center justify-between text-xs font-bold",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "bg-secondary px-2 py-0.5 rounded text-foreground font-bold border border-foreground/30",
											children: "SECURITY"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 116,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-muted-foreground",
											children: "18 Oct 2026"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 117,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 115,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
										className: "text-2xl font-display font-bold text-foreground flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Shield, { className: "h-5 w-5 text-primary" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 120,
											columnNumber: 17
										}, this), " Multi-Tab Self-Join Prevention"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 119,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-sm",
										children: "Fair play is strictly enforced. The game engine now prevents players from accidentally joining their own room twice across multiple tabs, guaranteeing authentic social deduction matches."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 122,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 113,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 48,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("footer", {
						className: "border-t-2 border-foreground/20 pt-6 flex flex-wrap gap-3 text-xs sm:text-sm font-bold text-primary",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/",
								className: "hover:underline",
								children: "Play Imposter World"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 130,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "•" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 131,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/how-to-play",
								className: "hover:underline",
								children: "How To Play"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 132,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "•" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 133,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/terms",
								className: "hover:underline",
								children: "Terms of Use"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 134,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "•" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 135,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/privacy",
								className: "hover:underline",
								children: "Privacy Policy"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 136,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "•" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 137,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/support",
								className: "hover:underline",
								children: "Support the Dev"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 138,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "•" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 139,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/delete-account",
								className: "hover:underline",
								children: "Delete Account"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 140,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 129,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 30,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 19,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 18,
		columnNumber: 10
	}, this);
}
//#endregion
export { NoticeBoardPage as component };
