import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { rt as ArrowLeft, w as Play } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/imposter-word-list-sMfhIxL_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var WORD_PAIRS = [
	{
		category: "Food & Drinks",
		common: "Samosa",
		imposter: "Kachori",
		tip: "Both are fried Indian savory snacks, but samosa is triangular and kachori is round."
	},
	{
		category: "Food & Drinks",
		common: "Coffee",
		imposter: "Tea",
		tip: "Both are hot morning beverages with caffeine, tricky for subtle clues."
	},
	{
		category: "Food & Drinks",
		common: "Pizza",
		imposter: "Burger",
		tip: "Both are global fast-food staples with cheese and bread."
	},
	{
		category: "Food & Drinks",
		common: "Butter Chicken",
		imposter: "Paneer Butter Masala",
		tip: "Identical gravy texture and orange-red color, but one is vegetarian."
	},
	{
		category: "Cricket & Sports",
		common: "Virat Kohli",
		imposter: "Rohit Sharma",
		tip: "Both are Indian cricketing legends, top batsmen, and World Cup champions."
	},
	{
		category: "Cricket & Sports",
		common: "Cricket Bat",
		imposter: "Hockey Stick",
		tip: "Both are wooden sports equipment used to hit a ball."
	},
	{
		category: "Cricket & Sports",
		common: "IPL (Indian Premier League)",
		imposter: "World Cup",
		tip: "Both are massively watched cricket tournaments."
	},
	{
		category: "Bollywood & Cinema",
		common: "Shah Rukh Khan",
		imposter: "Salman Khan",
		tip: "Both are Bollywood superstars known as Badshah and Bhaijaan."
	},
	{
		category: "Bollywood & Cinema",
		common: "Sholay",
		imposter: "Deewaar",
		tip: "Classic 70s Amitabh Bachchan blockbusters with iconic dialogues."
	},
	{
		category: "Bollywood & Cinema",
		common: "Popcorn",
		imposter: "Nachos",
		tip: "Standard movie theater cinema snacks with cheese or butter."
	},
	{
		category: "Animals & Nature",
		common: "Lion",
		imposter: "Tiger",
		tip: "Apex feline predators, one hunts in prides while the other has stripes."
	},
	{
		category: "Animals & Nature",
		common: "Dolphin",
		imposter: "Shark",
		tip: "Ocean predators with fins, but dolphins are playful mammals."
	},
	{
		category: "Animals & Nature",
		common: "Crocodile",
		imposter: "Alligator",
		tip: "Ancient reptiles with snout differences that confuse almost everyone."
	},
	{
		category: "Technology & Gadgets",
		common: "iPhone",
		imposter: "Android",
		tip: "Smartphones with touchscreens, cameras, and app ecosystems."
	},
	{
		category: "Technology & Gadgets",
		common: "Laptop",
		imposter: "Tablet",
		tip: "Portable computing devices used for work and entertainment."
	},
	{
		category: "Technology & Gadgets",
		common: "Instagram",
		imposter: "Snapchat",
		tip: "Visual photo social apps famous for 24-hour disappearing stories."
	},
	{
		category: "Places & Travel",
		common: "Mumbai",
		imposter: "Delhi",
		tip: "Mega Indian cities with distinct street food and bustling metro systems."
	},
	{
		category: "Places & Travel",
		common: "Goa",
		imposter: "Manali",
		tip: "Top Indian holiday destinations, but one is beaches and the other snow."
	},
	{
		category: "Places & Travel",
		common: "Taj Mahal",
		imposter: "Qutub Minar",
		tip: "Historic white marble vs red sandstone UNESCO heritage landmarks."
	}
];
function ImposterWordListPage() {
	const [selectedCat, setSelectedCat] = (0, import_react.useState)("All");
	const categories = [
		"All",
		"Food & Drinks",
		"Cricket & Sports",
		"Bollywood & Cinema",
		"Animals & Nature",
		"Technology & Gadgets",
		"Places & Travel"
	];
	const filtered = selectedCat === "All" ? WORD_PAIRS : WORD_PAIRS.filter((p) => p.category === selectedCat);
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
						children: "Imposter Word List"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "notebook relative p-6 sm:p-10 shadow-lg space-y-6 font-hand text-foreground leading-relaxed",
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
										children: "7,800+ Verified Pairs Database"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "text-3xl sm:text-5xl font-display text-foreground font-bold",
										children: "Imposter Word List & Clever Pairs"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-base sm:text-lg text-primary font-bold",
										children: "Curated tricky pairs designed to test your bluffing and deduction skills."
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/clue-magnifier.png",
								alt: "Clue Magnifier",
								className: "h-20 w-20 sm:h-24 sm:w-24 object-contain self-start sm:self-auto shrink-0 drop-shadow-md"
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 bg-primary/10 rounded-xl border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Want to play these words in real-time?" }), " All 7,800+ pairs are built right into the free online game."]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "sketch flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 font-bold hover:brightness-110 shrink-0 text-sm shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4 fill-current" }), " Play Word Game"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-bold text-muted-foreground uppercase tracking-wider",
							children: "Filter by Category:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: categories.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSelectedCat(cat),
								className: `sketch px-3 py-1 text-xs sm:text-sm font-bold transition-all ${selectedCat === cat ? "bg-foreground text-background" : "bg-white/80 hover:bg-secondary text-foreground"}`,
								children: cat
							}, cat))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "space-y-3 pt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-3.5",
							children: filtered.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 bg-white/85 rounded-lg border-2 border-foreground/20 space-y-2 shadow-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] font-bold bg-muted px-2 py-0.5 rounded text-muted-foreground",
											children: item.category
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-primary font-bold",
											children: "Tricky Pair"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-2 text-sm pt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-2 bg-primary/10 rounded border border-primary/20",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] text-muted-foreground uppercase font-bold",
												children: "Majority Word"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-display text-base font-bold text-primary",
												children: item.common
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-2 bg-accent/15 rounded border border-accent/30",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] text-muted-foreground uppercase font-bold",
												children: "Imposter Word"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-display text-base font-bold text-accent",
												children: item.imposter
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground leading-normal",
										children: ["💡 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: item.tip })]
									})
								]
							}, idx))
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
								to: "/imposter-game-questions",
								className: "text-primary underline font-bold",
								children: "Questions & Hints"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/faq",
								className: "text-primary underline font-bold",
								children: "FAQ"
							})
						]
					})
				]
			})]
		})
	});
}
//#endregion
export { ImposterWordListPage as component };
