import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { ot as ArrowLeft, tt as ChevronDown, w as Play } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/faq-CvucUa8I.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/Users/aadi/Downloads/f8225c15-5378-482e-bfe4-be001f84d384/src/routes/faq.tsx?tsr-split=component";
var FAQS = [
	{
		q: "What is Imposter World and how does it work?",
		a: "Imposter World is an online multiplayer party word game set in a nostalgic school classroom. At the start of each round, everyone receives the same secret word (e.g. 'Coffee'), but the Imposter receives a slightly different related word (e.g. 'Tea'). Players take turns giving subtle clues via drawing, text, or voice clips, followed by a discussion and vote to uncover the imposter."
	},
	{
		q: "How many players can play together?",
		a: "Online private rooms support 3 to 14 players. If you are sitting together with friends or family, you can use the 'Local Pass & Play' mode to share 1 single device between 2 to 10 players."
	},
	{
		q: "Is Imposter World free? Are there any in-app purchases?",
		a: "Imposter World is 100% free to play. All 7,800+ word pairs, real-time multiplayer modes, drawing tools, and audio voice clues are completely unlocked for everyone without any paywall."
	},
	{
		q: "Do I or my friends need to install an app or create an account?",
		a: "No download is required. It works directly in Chrome, Safari, Firefox, and Edge on any smartphone or computer. You can play instantly as a Guest with a single click, or sign in with Google to save your classroom win statistics and leaderboard ranking."
	},
	{
		q: "How do voice clues and drawing pads work?",
		a: "During clue-giving turns, players can type a text clue, use their finger/mouse to sketch a doodle on the vintage notebook drawing pad, or hold the vintage microphone button to record a quick voice snippet. The room host can customize which clue types are enabled in Room Settings."
	},
	{
		q: "How is cheating prevented?",
		a: "Unlike peer-to-peer web games where the secret word is sent to all devices, Imposter World keeps words and roles locked on a secure Node.js server. The client browser only ever receives its own assigned secret word, making client-side inspection or cheat scripts impossible."
	},
	{
		q: "What happens if the room host leaves mid-game?",
		a: "The room server automatically migrates host ownership to the next active player in the room seamlessly, ensuring your game continues without interruption."
	},
	{
		q: "Can players skip discussion if everyone is ready to vote?",
		a: "Yes! During the debate phase, players can click the 'Skip Discussion' button. Once a majority of players vote to skip, the round immediately transitions into the voting ballot box phase."
	}
];
function FAQPage() {
	const [openIdx, setOpenIdx] = (0, import_react.useState)(0);
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
							lineNumber: 36,
							columnNumber: 13
						}, this), " Home"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 35,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "/" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 38,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-foreground font-bold",
						children: "Frequently Asked Questions"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 39,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 34,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", {
				className: "notebook relative p-4 sm:p-8 md:p-10 shadow-lg space-y-6 font-hand text-foreground leading-relaxed",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "tape absolute -top-3 left-1/2 h-6 w-36 -translate-x-1/2 rotate-[-1deg]" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 44,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
						className: "border-b-2 border-foreground/20 pb-4 space-y-3",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "inline-block bg-highlight px-2.5 py-0.5 rounded text-xs font-bold border border-foreground/30",
										children: "Help Desk & FAQ"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 49,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
										className: "text-3xl sm:text-5xl font-display text-foreground font-bold",
										children: "Frequently Asked Questions"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 52,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-base sm:text-lg text-primary font-bold",
										children: "Everything you need to know about playing, hosting, and winning Imposter World."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 55,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 48,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
								src: "/detective.png",
								alt: "Detective Mascot",
								className: "h-20 w-20 sm:h-24 sm:w-24 object-contain self-start sm:self-auto shrink-0 drop-shadow-md"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 59,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 47,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 46,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "p-4 bg-primary/10 rounded-xl border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Have all your questions answered?" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 66,
								columnNumber: 15
							}, this), " Jump into class and start catching bluffers!"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 65,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: "/",
							className: "sketch flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 font-bold hover:brightness-110 shrink-0 text-sm shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Play, { className: "h-4 w-4 fill-current" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 69,
								columnNumber: 15
							}, this), " Create Room"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 68,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 64,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
						className: "space-y-3 pt-2",
						children: FAQS.map((faq, idx) => {
							const isOpen = openIdx === idx;
							return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "rounded-lg border-2 border-foreground/20 bg-white/85 overflow-hidden transition-all shadow-xs",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
									onClick: () => setOpenIdx(isOpen ? null : idx),
									className: "w-full text-left p-4 font-display text-lg font-bold text-foreground flex items-center justify-between gap-3 hover:bg-muted/30 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: faq.q }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 79,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronDown, { className: `h-5 w-5 text-primary shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}` }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 80,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 78,
									columnNumber: 19
								}, this), isOpen && /* @__PURE__ */ (void 0)("div", {
									className: "p-4 pt-0 text-sm text-foreground/90 border-t border-foreground/10 leading-relaxed font-hand",
									children: faq.a
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 82,
									columnNumber: 30
								}, this)]
							}, idx, true, {
								fileName: _jsxFileName,
								lineNumber: 77,
								columnNumber: 20
							}, this);
						})
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 74,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("footer", {
						className: "border-t border-foreground/20 pt-4 mt-6 text-xs sm:text-sm text-muted-foreground flex flex-wrap gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Explore more:" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 91,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/how-to-play",
								className: "text-primary underline font-bold",
								children: "How To Play"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 92,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "·" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 93,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/imposter-game-online",
								className: "text-primary underline font-bold",
								children: "Play Online"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 94,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "·" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 95,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/imposter-word-list",
								className: "text-primary underline font-bold",
								children: "Word List"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 96,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "·" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 97,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/imposter-game-questions",
								className: "text-primary underline font-bold",
								children: "Questions & Clues"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 98,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "·" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 99,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/privacy",
								className: "text-primary underline font-bold",
								children: "Privacy Policy"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 100,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 90,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 43,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 32,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 31,
		columnNumber: 10
	}, this);
}
//#endregion
export { FAQPage as component };
