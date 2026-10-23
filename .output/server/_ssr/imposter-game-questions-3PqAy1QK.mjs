import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { I as Lightbulb, Y as CircleQuestionMark, rt as ArrowLeft, w as Play } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/imposter-game-questions-3PqAy1QK.js
var import_jsx_runtime = require_jsx_runtime();
var QUESTION_CATEGORIES = [
	{
		title: "Environment & Location Questions",
		desc: "Trap bluffers by asking where the object belongs without naming specific rooms.",
		questions: [
			"Is this something you would expect to find inside a school bag?",
			"Would you encounter this more frequently in the morning or at midnight?",
			"Is this typically kept in the kitchen, living room, or outdoors?",
			"Can this be purchased in a standard neighborhood grocery store?",
			"Is this something found in high altitudes or near water bodies?"
		]
	},
	{
		title: "Sensory & Physical Attribute Questions",
		desc: "Test subtle qualities like texture, temperature, weight, and sound.",
		questions: [
			"If you dropped this on a tiled classroom floor, would it break or bounce?",
			"Does this usually feel hot, cold, or room temperature?",
			"Is this smaller than a pencil box, or bigger than a student desk?",
			"Does this produce an audible sound when being used?",
			"Is this flexible like paper, or rigid like cast iron?"
		]
	},
	{
		title: "Usage & Action Questions",
		desc: "Check whether the suspect actually understands how people interact with the word.",
		questions: [
			"Do people consume this, wear this, or operate this with their hands?",
			"Would you feel comfortable gifting this to your teacher on Teachers' Day?",
			"Is this powered by electricity, battery, or human effort?",
			"How frequently does an average person use or interact with this in a single week?",
			"Would you take this with you when going on a family picnic?"
		]
	}
];
function ImposterGameQuestionsPage() {
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
						children: "Imposter Game Questions"
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
										className: "inline-block bg-accent text-accent-foreground px-2.5 py-0.5 rounded text-xs font-bold",
										children: "Classroom Interrogation Manual"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "text-3xl sm:text-5xl font-display text-foreground font-bold",
										children: "Imposter Game Questions & Clues"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-base sm:text-lg text-primary font-bold",
										children: "How to ask strategic questions during the discussion phase to catch the bluffer."
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/stamp-confidential.png",
								alt: "Confidential Stamp",
								className: "h-20 w-20 sm:h-24 sm:w-24 object-contain self-start sm:self-auto shrink-0 drop-shadow-md"
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 bg-primary/10 rounded-xl border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Put these interrogation questions to the test!" }), " Create a room and play with your group now."]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "sketch flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 font-bold hover:brightness-110 shrink-0 text-sm shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4 fill-current" }), " Play Online"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "space-y-6 pt-2",
						children: QUESTION_CATEGORIES.map((cat, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-b border-foreground/20 pb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "text-xl font-display font-bold text-foreground flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-5 w-5 text-accent" }),
										" ",
										cat.title
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: cat.desc
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 gap-2",
								children: cat.questions.map((q, qIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 bg-white/80 rounded-md border border-foreground/20 flex items-start gap-2.5 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-bold text-primary shrink-0",
										children: [
											"Q",
											qIdx + 1,
											"."
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: q
									})]
								}, qIdx))
							})]
						}, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "space-y-3 pt-3 p-4 bg-muted/40 rounded-xl border border-foreground/20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-lg font-display font-bold text-foreground flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { className: "h-5 w-5 text-primary" }), " The Golden Rules of Giving Clues"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "space-y-2 text-xs sm:text-sm text-foreground/90",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "1. Never use rhyming words or direct anagrams:" }), " Saying \"Sounds like bat\" when the word is \"Cat\" immediately gives it away to the Imposter."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "2. Give multi-layered clues:" }), " Use feelings, colors, context, or personal memories (e.g. \"We ate this during the 2023 train trip\")."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "3. If you suspect someone is the Imposter:" }), " Ask them to explain why their previous clue fits the category. Bluffers will often hesitate or give contradictory answers."] })
							]
						})]
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
								to: "/imposter-word-list",
								className: "text-primary underline font-bold",
								children: "Word List"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/imposter-game-online",
								className: "text-primary underline font-bold",
								children: "Play Online"
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
export { ImposterGameQuestionsPage as component };
