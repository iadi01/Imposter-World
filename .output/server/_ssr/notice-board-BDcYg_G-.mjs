import { o as __toESM } from "../_runtime.mjs";
import { t as API_BASE } from "./api-OZfBBcXI.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { j as Mic, p as Shield, rt as ArrowLeft, s as Trophy } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notice-board-BDcYg_G-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
						children: "Notice Board"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "notebook relative p-4 sm:p-8 md:p-10 shadow-lg space-y-6 font-hand text-foreground leading-relaxed",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "tape absolute -top-3 left-1/2 h-6 w-36 -translate-x-1/2 rotate-[-1deg]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "border-b-2 border-foreground/20 pb-4 space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-block bg-highlight px-2.5 py-0.5 rounded text-xs font-bold border border-foreground/30",
								children: "📌 Official Bulletins"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-4xl sm:text-5xl font-display text-foreground font-bold flex items-center gap-2",
								children: "Classroom Notice Board"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg text-primary font-bold",
								children: "Class announcements, patch updates, and competitive tournament notices."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Pinned by Classroom Monitor: Adi · Last updated 21 October 2026"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sketch bg-[#EBF3FF] p-5 space-y-2 border-2 border-primary shadow-xs relative",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "tape absolute -top-2 left-6 h-4 w-20 rotate-[-2deg]" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-xs font-bold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "bg-accent text-accent-foreground px-2 py-0.5 rounded",
											children: "TOURNAMENT"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Every Wednesday"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "text-2xl font-display font-bold text-primary flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-5 w-5 text-accent" }), " Tournament Desk 🏆"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Next one today (Wed):" }), " Top detectives clash in the 8-player bracket!"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded bg-white/90 p-2.5 text-xs font-bold text-accent border border-accent/20",
										children: [
											"👑 ",
											championName,
											" currently holds the championship belt!"
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sketch bg-white/95 p-5 space-y-2 border-2 border-accent shadow-xs relative",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "tape absolute -top-2 left-6 h-4 w-20 rotate-[-3deg]" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-xs font-bold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "bg-accent text-accent-foreground px-2 py-0.5 rounded",
											children: "NEW FEATURE"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "21 Oct 2026"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "text-2xl font-display font-bold text-foreground flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "h-5 w-5 text-accent" }), " Live Voice Hints Now Active!"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm",
										children: [
											"Students can now speak their clues out loud! On your hint turn, tap ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "\"Voice Clue 🎙️\"" }),
											" to record a crisp audio clip or live speech transcript. Classmates can tap the audio cassette on the pinboard to listen to your clue in real-time."
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sketch bg-white/90 p-5 space-y-2 border border-foreground/30 shadow-xs relative",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "tape absolute -top-2 left-6 h-4 w-20 rotate-[2deg]" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-xs font-bold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "bg-primary text-primary-foreground px-2 py-0.5 rounded",
											children: "GAMEPLAY"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "20 Oct 2026"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-2xl font-display font-bold text-foreground",
										children: "🎨 Paint Bucket & Flood Fill in Drawing Pad"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm",
										children: "The drawing canvas now includes a fast flood-fill Paint Bucket tool with 1-click Undo! Color large areas of your sketch instantly to give faster and more expressive hints."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sketch bg-white/90 p-5 space-y-2 border border-foreground/30 shadow-xs relative",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "tape absolute -top-2 left-6 h-4 w-20 rotate-[-1deg]" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-xs font-bold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "bg-highlight px-2 py-0.5 rounded text-foreground font-bold border border-foreground/30",
											children: "RANKINGS"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "19 Oct 2026"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "text-2xl font-display font-bold text-foreground flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-5 w-5 text-accent" }), " 3-Tier Leaderboards (Global, Country & State)"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm",
										children: "Compete against players worldwide, across India, or within your home state (Maharashtra, Delhi, Karnataka, etc.)! Track total wins, detective accuracy, and imposter survival rates."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sketch bg-white/90 p-5 space-y-2 border border-foreground/30 shadow-xs relative",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "tape absolute -top-2 left-6 h-4 w-20 rotate-[1deg]" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-xs font-bold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "bg-secondary px-2 py-0.5 rounded text-foreground font-bold border border-foreground/30",
											children: "SECURITY"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "18 Oct 2026"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "text-2xl font-display font-bold text-foreground flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-5 w-5 text-primary" }), " Multi-Tab Self-Join Prevention"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm",
										children: "Fair play is strictly enforced. The game engine now prevents players from accidentally joining their own room twice across multiple tabs, guaranteeing authentic social deduction matches."
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
						className: "border-t-2 border-foreground/20 pt-6 flex flex-wrap gap-3 text-xs sm:text-sm font-bold text-primary",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								className: "hover:underline",
								children: "Play Imposter World"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/how-to-play",
								className: "hover:underline",
								children: "How To Play"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/terms",
								className: "hover:underline",
								children: "Terms of Use"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/privacy",
								className: "hover:underline",
								children: "Privacy Policy"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/support",
								className: "hover:underline",
								children: "Support the Dev"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/delete-account",
								className: "hover:underline",
								children: "Delete Account"
							})
						]
					})
				]
			})]
		})
	});
}
//#endregion
export { NoticeBoardPage as component };
