import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Z as ChevronDown, nt as ArrowLeft, w as Play } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/faq-9trRYDbq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-screen px-3 py-6 md:px-8 md:py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-4xl space-y-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex items-center gap-2 text-sm font-hand text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "text-primary hover:underline flex items-center gap-1 font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Home"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-foreground font-bold",
						children: "Frequently Asked Questions"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "notebook relative p-4 sm:p-8 md:p-10 shadow-lg space-y-6 font-hand text-foreground leading-relaxed",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "tape absolute -top-3 left-1/2 h-6 w-36 -translate-x-1/2 rotate-[-1deg]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
						className: "border-b-2 border-foreground/20 pb-4 space-y-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "inline-block bg-highlight px-2.5 py-0.5 rounded text-xs font-bold border border-foreground/30",
										children: "Help Desk & FAQ"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "text-3xl sm:text-5xl font-display text-foreground font-bold",
										children: "Frequently Asked Questions"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-base sm:text-lg text-primary font-bold",
										children: "Everything you need to know about playing, hosting, and winning Imposter World."
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/detective.png",
								alt: "Detective Mascot",
								className: "h-20 w-20 sm:h-24 sm:w-24 object-contain self-start sm:self-auto shrink-0 drop-shadow-md"
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 bg-primary/10 rounded-xl border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Have all your questions answered?" }), " Jump into class and start catching bluffers!"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "sketch flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 font-bold hover:brightness-110 shrink-0 text-sm shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4 fill-current" }), " Create Room"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "space-y-3 pt-2",
						children: FAQS.map((faq, idx) => {
							const isOpen = openIdx === idx;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border-2 border-foreground/20 bg-white/85 overflow-hidden transition-all shadow-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setOpenIdx(isOpen ? null : idx),
									className: "w-full text-left p-4 font-display text-lg font-bold text-foreground flex items-center justify-between gap-3 hover:bg-muted/30 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: faq.q }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-5 w-5 text-primary shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}` })]
								}), isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-4 pt-0 text-sm text-foreground/90 border-t border-foreground/10 leading-relaxed font-hand",
									children: faq.a
								})]
							}, idx);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
						className: "border-t border-foreground/20 pt-4 mt-6 text-xs sm:text-sm text-muted-foreground flex flex-wrap gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Explore more:" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/how-to-play",
								className: "text-primary underline font-bold",
								children: "How To Play"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/imposter-game-online",
								className: "text-primary underline font-bold",
								children: "Play Online"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/imposter-word-list",
								className: "text-primary underline font-bold",
								children: "Word List"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/imposter-game-questions",
								className: "text-primary underline font-bold",
								children: "Questions & Clues"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/privacy",
								className: "text-primary underline font-bold",
								children: "Privacy Policy"
							})
						]
					})
				]
			})]
		})
	});
}
//#endregion
export { FAQPage as component };
