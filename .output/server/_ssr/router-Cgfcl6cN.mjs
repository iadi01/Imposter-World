import { t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { S as useRouter, _ as lazyRouteComponent, b as Link, f as Scripts, g as Outlet, h as createRouter, p as HeadContent, v as createFileRoute, y as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { t as ARTICLES } from "./articles-data-BkRX9pQa.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Cgfcl6cN.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var styles_default = "/assets/styles-cXzavuhb.css";
var _jsxFileName = "/Users/aadi/Downloads/f8225c15-5378-482e-bfe4-be001f84d384/src/routes/__root.tsx";
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 19,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 20,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 21,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 25,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 24,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 18,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 17,
		columnNumber: 5
	}, this);
}
function ErrorComponent({ error, reset }) {
	console.error("[Imposter World Error]", error);
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 44,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 47,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 51,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 60,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 50,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 43,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 42,
		columnNumber: 5
	}, this);
}
var Route$15 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
			},
			{ title: "Imposter World | Play the Imposter Game Online Free" },
			{
				name: "description",
				content: "Play Imposter World, a free online multiplayer imposter word game with friends. Discover secret words, give drawing and voice clues, deduce the bluffer, and catch the imposter without downloading an app."
			},
			{
				name: "keywords",
				content: "imposter game, imposter game online, play imposter online, imposter game with friends, imposter word game, free imposter game"
			},
			{
				property: "og:site_name",
				content: "Imposter World"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:title",
				content: "Imposter World — Play Multiplayer Imposter Game Online"
			},
			{
				property: "og:description",
				content: "Join friends, give clever clues, interrogate bluffers, and catch the classroom imposter online for free."
			},
			{
				property: "og:image",
				content: "https://imposter-world.onrender.com/classroom-bg.jpg"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: "Imposter World — Online Imposter Party Game"
			},
			{
				name: "twitter:description",
				content: "Play the nostalgic classroom notebook multiplayer imposter game with friends."
			},
			{
				name: "twitter:image",
				content: "https://imposter-world.onrender.com/classroom-bg.jpg"
			},
			{
				name: "google-site-verification",
				content: "lCqNkkCEBBU4MDc48vu3_ZwiS8Ml0cFtmn8JyQ6iDIA"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Caveat+Brush&family=Kalam:wght@400;700&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "apple-touch-icon",
				href: "/detective.png"
			}
		],
		scripts: [
			{
				src: "https://www.googletagmanager.com/gtag/js?id=G-DPETXW891Q",
				async: true
			},
			{ children: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-DPETXW891Q');` },
			{
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@graph": [
						{
							"@type": "WebSite",
							"@id": "https://imposter-world.onrender.com/#website",
							"url": "https://imposter-world.onrender.com/",
							"name": "Imposter World",
							"description": "Free Online Multiplayer Imposter Word Game with Friends",
							"inLanguage": "en-US"
						},
						{
							"@type": "WebApplication",
							"@id": "https://imposter-world.onrender.com/#app",
							"name": "Imposter World",
							"url": "https://imposter-world.onrender.com/",
							"applicationCategory": "GameApplication",
							"operatingSystem": "Any (web browser)",
							"description": "A multiplayer imposter word game to play online with friends.",
							"offers": {
								"@type": "Offer",
								"price": "0",
								"priceCurrency": "USD"
							}
						},
						{
							"@type": "VideoGame",
							"@id": "https://imposter-world.onrender.com/#game",
							"name": "Imposter World",
							"url": "https://imposter-world.onrender.com/",
							"description": "Multiplayer classroom notebook party game where players receive secret words, give subtle clues, and deduce who the imposter is.",
							"genre": [
								"Party Game",
								"Word Game",
								"Social Deduction",
								"Multiplayer"
							],
							"gamePlatform": ["Web Browser", "Mobile Browser"],
							"numberOfPlayers": {
								"@type": "QuantitativeValue",
								"minValue": 3,
								"maxValue": 14
							},
							"image": "https://imposter-world.onrender.com/detective.png"
						},
						{
							"@type": "FAQPage",
							"@id": "https://imposter-world.onrender.com/#faq",
							"mainEntity": [
								{
									"@type": "Question",
									"name": "What is the Imposter Game online?",
									"acceptedAnswer": {
										"@type": "Answer",
										"text": "The Imposter Game is a viral social deduction word game where every player in the room receives the same secret word, except one hidden player who is the imposter. Players take turns giving subtle one-word, drawing, or voice clues to prove they know the secret word without revealing it to the imposter. At the end of the round, players debate and vote to unmask the bluffer."
									}
								},
								{
									"@type": "Question",
									"name": "What is the difference between imposter vs impostor?",
									"acceptedAnswer": {
										"@type": "Answer",
										"text": "Both 'imposter' and 'impostor' are valid spellings of the exact same noun meaning a pretender or deceiver. 'Impostor' is the classical historical Latin spelling, while 'imposter' is the modern standard used in digital culture, search engines, and viral party games like Imposter World and Among Us."
									}
								},
								{
									"@type": "Question",
									"name": "What does being an imposter mean in the word game?",
									"acceptedAnswer": {
										"@type": "Answer",
										"text": "In Imposter World, the imposter is a player who either receives no word or a subtly different decoy word. The imposter must deduce the true secret word from other players' clues and bluff their own clues convincingly to avoid being voted out."
									}
								},
								{
									"@type": "Question",
									"name": "How to play Imposter online with friends for free without downloading an app?",
									"acceptedAnswer": {
										"@type": "Answer",
										"text": "Open Imposter World in any browser on your phone, tablet, or laptop. Tap 'Create Room', choose your game settings, and share the room code or 1-click invite link with up to 14 friends. No downloads, installations, or signups are required."
									}
								},
								{
									"@type": "Question",
									"name": "Can I play Imposter World on a single device offline (Pass and Play)?",
									"acceptedAnswer": {
										"@type": "Answer",
										"text": "Yes! Imposter World includes a full offline Pass & Play mode. Up to 14 players can share one phone or tablet, secretly inspecting their assigned word using a private reveal shield before starting an in-person classroom discussion."
									}
								}
							]
						}
					]
				})
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("head", { children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("meta", {
				name: "google-site-verification",
				content: "lCqNkkCEBBU4MDc48vu3_ZwiS8Ml0cFtmn8JyQ6iDIA"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 229,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("script", {
				async: true,
				src: "https://www.googletagmanager.com/gtag/js?id=G-DPETXW891Q"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 231,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("script", { dangerouslySetInnerHTML: { __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-DPETXW891Q');` } }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 232,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(HeadContent, {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 240,
				columnNumber: 9
			}, this)
		] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 228,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Scripts, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 244,
			columnNumber: 9
		}, this)] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 242,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 227,
		columnNumber: 5
	}, this);
}
function RootComponent() {
	const { queryClient } = Route$15.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Outlet, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 256,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 254,
		columnNumber: 5
	}, this);
}
var $$splitComponentImporter$14 = () => import("./routes-Bmd1H5uc.mjs");
var Route$14 = createFileRoute("/")({
	head: () => ({
		meta: [{ title: "Imposter World — Real-Time Multiplayer Party Game" }, {
			name: "description",
			content: "A classroom notebook multiplayer party word game. Find the imposter before time runs out!"
		}],
		links: [{
			rel: "canonical",
			href: "https://imposter-world.onrender.com/"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./admin-DSVNai4b.mjs");
var Route$13 = createFileRoute("/admin")({
	head: () => ({ meta: [{ title: "Page Not Found — Imposter World" }, {
		name: "robots",
		content: "noindex, nofollow"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./articles-GptQ7MTU.mjs");
var SITE_URL = "https://imposter-world.onrender.com";
var Route$12 = createFileRoute("/articles")({
	head: () => ({
		meta: [
			{ title: "Game Articles & Strategy Guides — Imposter World" },
			{
				name: "description",
				content: "Official Imposter World Strategy Observatory: Free guides, deduction masterclasses, imposter bluffing playbooks, word pair analyses, and party rules."
			},
			{
				name: "keywords",
				content: "imposter game strategy, how to play imposter game, imposter bluffing guide, detective deduction tips, imposter world articles, party word game strategies, pass and play rules"
			},
			{
				property: "og:title",
				content: "Game Articles & Strategy Guides — Imposter World"
			},
			{
				property: "og:description",
				content: "Master social deduction with free strategy guides, imposter bluffing tips, and detective rules."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:url",
				content: `${SITE_URL}/articles`
			},
			{
				property: "og:image",
				content: `${SITE_URL}/classroom-bg.jpg`
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: "Game Articles & Strategy Guides — Imposter World"
			},
			{
				name: "twitter:description",
				content: "Master social deduction with free strategy guides, imposter bluffing tips, and detective rules."
			},
			{
				name: "twitter:image",
				content: `${SITE_URL}/classroom-bg.jpg`
			},
			{
				name: "robots",
				content: "index, follow, max-image-preview:large, max-snippet:-1"
			}
		],
		links: [{
			rel: "canonical",
			href: `${SITE_URL}/articles`
		}],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@graph": [
					{
						"@type": "CollectionPage",
						"@id": `${SITE_URL}/articles#collection`,
						name: "Imposter World Strategy Observatory & Game Articles",
						url: `${SITE_URL}/articles`,
						inLanguage: "en-US",
						description: "Official strategy observatory for Imposter World. Guides on clue formulating, deception detection, bluffing tactics, and party game modes.",
						publisher: {
							"@type": "Organization",
							name: "Imposter World",
							url: SITE_URL,
							logo: {
								"@type": "ImageObject",
								url: `${SITE_URL}/detective.png`
							}
						},
						hasPart: ARTICLES.slice(0, 50).map((a) => ({
							"@type": "Article",
							headline: a.title,
							author: {
								"@type": "Person",
								name: a.author
							},
							datePublished: a.date,
							articleSection: a.category,
							description: a.summary,
							url: `${SITE_URL}/articles#${a.id}`
						}))
					},
					{
						"@type": "ItemList",
						"@id": `${SITE_URL}/articles#list`,
						name: "Imposter World Strategy Articles",
						numberOfItems: ARTICLES.length,
						itemListElement: ARTICLES.slice(0, 50).map((a, i) => ({
							"@type": "ListItem",
							position: i + 1,
							url: `${SITE_URL}/articles#${a.id}`,
							name: a.title
						}))
					},
					{
						"@type": "BreadcrumbList",
						itemListElement: [{
							"@type": "ListItem",
							position: 1,
							name: "Home",
							item: `${SITE_URL}/`
						}, {
							"@type": "ListItem",
							position: 2,
							name: "Articles",
							item: `${SITE_URL}/articles`
						}]
					}
				]
			})
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./delete-account-BeM195pY.mjs");
var Route$11 = createFileRoute("/delete-account")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./faq-CvucUa8I.mjs");
var Route$10 = createFileRoute("/faq")({
	head: () => ({
		meta: [
			{ title: "Frequently Asked Questions (FAQ) — Imposter World" },
			{
				name: "description",
				content: "Everything you need to know about playing Imposter World. Answers about player limits, anti-cheat features, rules, voice clues, and device compatibility."
			},
			{
				name: "keywords",
				content: "imposter game FAQ, how to play imposter game, imposter game rules, is imposter world free, how many players can play imposter"
			},
			{
				property: "og:title",
				content: "Frequently Asked Questions (FAQ) — Imposter World"
			},
			{
				property: "og:description",
				content: "Find quick answers to common questions about Imposter World."
			},
			{
				property: "og:image",
				content: "https://imposter-world.onrender.com/classroom-bg.jpg"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://imposter-world.onrender.com/faq"
		}],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "FAQPage",
				"mainEntity": [
					{
						"@type": "Question",
						"name": "What is Imposter World?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "Imposter World is a free real-time multiplayer social deduction party word game. Players receive a secret word, while one player (the Imposter) receives a lookalike word. Detectives must identify the imposter through clues and debate."
						}
					},
					{
						"@type": "Question",
						"name": "How many players can play Imposter World?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "You can play with 3 to 14 players in private rooms, or pass 1 phone around in Local Pass and Play mode for 2 to 10 players."
						}
					},
					{
						"@type": "Question",
						"name": "Is Imposter World completely free?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "Yes, Imposter World is 100% free with no paywalls, subscriptions, or forced video ads."
						}
					},
					{
						"@type": "Question",
						"name": "Do I need to download an app to play?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "No. Imposter World runs directly inside your web browser on mobile phones, tablets, laptops, and desktop computers."
						}
					},
					{
						"@type": "Question",
						"name": "Can players cheat by inspecting the code?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "No. Imposter World uses shielded server-side state. Secret words and imposter assignments exist solely in encrypted server memory and are never leaked to client browsers until the round ends."
						}
					}
				]
			})
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./how-to-play-BY97vJJM.mjs");
var Route$9 = createFileRoute("/how-to-play")({
	head: () => ({
		meta: [
			{ title: "How To Play Imposter World — Complete Classroom Rules & Guide" },
			{
				name: "description",
				content: "Learn how to play Imposter World step-by-step. Discover secret word reveal, drawing & text clue turns, debate interrogation, and voting rules with visual illustrations."
			},
			{
				property: "og:title",
				content: "How To Play Imposter World — Classroom Guide"
			},
			{
				property: "og:description",
				content: "Learn how to play Imposter World step-by-step with illustrated rules and strategies."
			},
			{
				property: "og:image",
				content: "https://imposter-world.onrender.com/classroom-bg.jpg"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://imposter-world.onrender.com/how-to-play"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./imposter-game-online-DPYkrSUr.mjs");
var Route$8 = createFileRoute("/imposter-game-online")({
	head: () => ({
		meta: [
			{ title: "Play Imposter Game Online Free — No Download Required | Imposter World" },
			{
				name: "description",
				content: "Play the best online Imposter word game directly in your browser. Join friends with a secret room code or play instantly. No download or app install needed."
			},
			{
				name: "keywords",
				content: "imposter game online, play imposter online, online imposter game, free imposter game no download, imposter browser game"
			},
			{
				property: "og:title",
				content: "Play Imposter Game Online Free — Imposter World"
			},
			{
				property: "og:description",
				content: "Jump into real-time classroom deduction word game with friends online. Free and works on phone and PC."
			},
			{
				property: "og:image",
				content: "https://imposter-world.onrender.com/classroom-bg.jpg"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://imposter-world.onrender.com/imposter-game-online"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./imposter-game-questions-UvxHPaUL.mjs");
var Route$7 = createFileRoute("/imposter-game-questions")({
	head: () => ({
		meta: [
			{ title: "Best Imposter Game Questions & Clue Giving Ideas | Imposter World" },
			{
				name: "description",
				content: "Discover the best questions, clue ideas, and interrogation tips for playing the Imposter word game. Learn how to trap the imposter and bluff convincingly."
			},
			{
				name: "keywords",
				content: "imposter game questions, imposter game hints, imposter questions, how to interrogate in imposter game, imposter clue ideas"
			},
			{
				property: "og:title",
				content: "Best Imposter Game Questions & Clue Giving Ideas — Imposter World"
			},
			{
				property: "og:description",
				content: "Master the interrogation round with clever questions that catch the bluffer."
			},
			{
				property: "og:image",
				content: "https://imposter-world.onrender.com/classroom-bg.jpg"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://imposter-world.onrender.com/imposter-game-questions"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./imposter-game-with-friends-DyM0O9BR.mjs");
var Route$6 = createFileRoute("/imposter-game-with-friends")({
	head: () => ({
		meta: [
			{ title: "Play Imposter Game With Friends — Online Multiplayer Party Game | Imposter World" },
			{
				name: "description",
				content: "Looking for a fun online party word game to play with friends? Start an Imposter World room for 3 to 14 players. Perfect for group calls, dorms, and party nights."
			},
			{
				name: "keywords",
				content: "imposter game with friends, play imposter with friends, multiplayer imposter game, imposter game for parties, party word game online"
			},
			{
				property: "og:title",
				content: "Play Imposter Game With Friends Online — Imposter World"
			},
			{
				property: "og:description",
				content: "Create a private room in 5 seconds. Send the secret invite link to your friends and catch the imposter together!"
			},
			{
				property: "og:image",
				content: "https://imposter-world.onrender.com/classroom-bg.jpg"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://imposter-world.onrender.com/imposter-game-with-friends"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./imposter-word-list-CKnEmF6O.mjs");
var Route$5 = createFileRoute("/imposter-word-list")({
	head: () => ({
		meta: [
			{ title: "Best Imposter Word List & Tricky Word Pairs | Imposter World" },
			{
				name: "description",
				content: "Browse 100+ clever and tricky Imposter word pairs for your game night. Categories include Bollywood, Cricket, Food & Drinks, Animals, Tech, and Places."
			},
			{
				name: "keywords",
				content: "imposter word list, imposter words, imposter game word pairs, tricky imposter words, bollywood imposter words, cricket imposter words"
			},
			{
				property: "og:title",
				content: "Best Imposter Word List & Tricky Word Pairs — Imposter World"
			},
			{
				property: "og:description",
				content: "Discover 7,000+ verified lookalike word pairs that make bluffing fun and deceptive."
			},
			{
				property: "og:image",
				content: "https://imposter-world.onrender.com/classroom-bg.jpg"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://imposter-world.onrender.com/imposter-word-list"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./notice-board-BJRT0OnC.mjs");
var Route$4 = createFileRoute("/notice-board")({
	head: () => ({
		meta: [
			{ title: "Classroom Notice Board — Imposter World Updates & Hall of Fame" },
			{
				name: "description",
				content: "Official Imposter World Classroom Notice Board: Season leaderboards, updates, audio features, and community announcements."
			},
			{
				property: "og:title",
				content: "Classroom Notice Board — Imposter World"
			},
			{
				property: "og:description",
				content: "Check the daily top detective champion and latest game patch notes."
			},
			{
				property: "og:image",
				content: "https://imposter-world.onrender.com/classroom-bg.jpg"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://imposter-world.onrender.com/notice-board"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./privacy-DtYlhhcw.mjs");
var Route$3 = createFileRoute("/privacy")({
	head: () => ({
		meta: [{ title: "Privacy Policy — Imposter World" }, {
			name: "description",
			content: "Privacy policy for Imposter World game. Learn how we protect player privacy and respect student data."
		}],
		links: [{
			rel: "canonical",
			href: "https://imposter-world.onrender.com/privacy"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./support-BtL_Iw9Y.mjs");
var Route$2 = createFileRoute("/support")({
	head: () => ({
		meta: [
			{ title: "Support the Developer — Imposter World ☕" },
			{
				name: "description",
				content: "Voluntary developer funding for Imposter World — servers, hosting, and classroom party multiplayer kept 100% free."
			},
			{
				property: "og:title",
				content: "Support the Developer — Imposter World ☕"
			},
			{
				property: "og:description",
				content: "Voluntary developer funding for Imposter World — servers, hosting, and classroom party multiplayer kept 100% free."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://imposter-world.onrender.com/support"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./terms-Bb6mUafP.mjs");
var Route$1 = createFileRoute("/terms")({
	head: () => ({
		meta: [{ title: "Terms of Use — Imposter World" }, {
			name: "description",
			content: "Terms of use and fair play guidelines for Imposter World multiplayer party game."
		}],
		links: [{
			rel: "canonical",
			href: "https://imposter-world.onrender.com/terms"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./api.auth.google.callback-CEPa-vje.mjs");
var Route = createFileRoute("/api/auth/google/callback")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$14.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$15
	}),
	AdminRoute: Route$13.update({
		id: "/admin",
		path: "/admin",
		getParentRoute: () => Route$15
	}),
	ArticlesRoute: Route$12.update({
		id: "/articles",
		path: "/articles",
		getParentRoute: () => Route$15
	}),
	DeleteAccountRoute: Route$11.update({
		id: "/delete-account",
		path: "/delete-account",
		getParentRoute: () => Route$15
	}),
	FaqRoute: Route$10.update({
		id: "/faq",
		path: "/faq",
		getParentRoute: () => Route$15
	}),
	HowToPlayRoute: Route$9.update({
		id: "/how-to-play",
		path: "/how-to-play",
		getParentRoute: () => Route$15
	}),
	ImposterGameOnlineRoute: Route$8.update({
		id: "/imposter-game-online",
		path: "/imposter-game-online",
		getParentRoute: () => Route$15
	}),
	ImposterGameQuestionsRoute: Route$7.update({
		id: "/imposter-game-questions",
		path: "/imposter-game-questions",
		getParentRoute: () => Route$15
	}),
	ImposterGameWithFriendsRoute: Route$6.update({
		id: "/imposter-game-with-friends",
		path: "/imposter-game-with-friends",
		getParentRoute: () => Route$15
	}),
	ImposterWordListRoute: Route$5.update({
		id: "/imposter-word-list",
		path: "/imposter-word-list",
		getParentRoute: () => Route$15
	}),
	NoticeBoardRoute: Route$4.update({
		id: "/notice-board",
		path: "/notice-board",
		getParentRoute: () => Route$15
	}),
	PrivacyRoute: Route$3.update({
		id: "/privacy",
		path: "/privacy",
		getParentRoute: () => Route$15
	}),
	SupportRoute: Route$2.update({
		id: "/support",
		path: "/support",
		getParentRoute: () => Route$15
	}),
	TermsRoute: Route$1.update({
		id: "/terms",
		path: "/terms",
		getParentRoute: () => Route$15
	}),
	ApiAuthGoogleCallbackRoute: Route.update({
		id: "/api/auth/google/callback",
		path: "/api/auth/google/callback",
		getParentRoute: () => Route$15
	})
};
var routeTree = Route$15._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
