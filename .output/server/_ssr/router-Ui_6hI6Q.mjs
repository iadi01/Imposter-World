import { t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { S as useRouter, _ as lazyRouteComponent, b as Link, f as Scripts, g as Outlet, h as createRouter, p as HeadContent, v as createFileRoute, y as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Ui_6hI6Q.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var styles_default = "/assets/styles-jIyh6IGM.css";
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
var Route$14 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
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
				content: "https://imposterworld.xyz/classroom-bg.jpg"
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
				content: "https://imposterworld.xyz/classroom-bg.jpg"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "canonical",
				href: "https://imposterworld.xyz/"
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
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@graph": [{
					"@type": "WebSite",
					"@id": "https://imposterworld.xyz/#website",
					"url": "https://imposterworld.xyz/",
					"name": "Imposter World",
					"description": "Free Online Multiplayer Imposter Word Game with Friends",
					"inLanguage": "en-US"
				}, {
					"@type": "VideoGame",
					"@id": "https://imposterworld.xyz/#game",
					"name": "Imposter World",
					"url": "https://imposterworld.xyz/",
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
					"image": "https://imposterworld.xyz/detective.png"
				}]
			})
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("head", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(HeadContent, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 154,
			columnNumber: 9
		}, this) }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 153,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Scripts, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 158,
			columnNumber: 9
		}, this)] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 156,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 152,
		columnNumber: 5
	}, this);
}
function RootComponent() {
	const { queryClient } = Route$14.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Outlet, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 170,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 168,
		columnNumber: 5
	}, this);
}
var $$splitComponentImporter$13 = () => import("./routes-CHyJbM_o.mjs");
var Route$13 = createFileRoute("/")({
	head: () => ({ meta: [{ title: "Imposter World — Real-Time Multiplayer Party Game" }, {
		name: "description",
		content: "A classroom notebook multiplayer party word game. Find the imposter before time runs out!"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./admin-Cp5xmH9d.mjs");
var Route$12 = createFileRoute("/admin")({
	head: () => ({ meta: [{ title: "Page Not Found — Imposter World" }, {
		name: "robots",
		content: "noindex, nofollow"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./delete-account-BeM195pY.mjs");
var Route$11 = createFileRoute("/delete-account")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./faq-DouBnqX5.mjs");
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
				content: "https://imposterworld.xyz/classroom-bg.jpg"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://imposterworld.xyz/faq"
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
var $$splitComponentImporter$9 = () => import("./how-to-play-CiZiVELk.mjs");
var Route$9 = createFileRoute("/how-to-play")({
	head: () => ({ meta: [
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
		}
	] }),
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
				content: "https://imposterworld.xyz/classroom-bg.jpg"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://imposterworld.xyz/imposter-game-online"
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
				content: "https://imposterworld.xyz/classroom-bg.jpg"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://imposterworld.xyz/imposter-game-questions"
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
				content: "https://imposterworld.xyz/classroom-bg.jpg"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://imposterworld.xyz/imposter-game-with-friends"
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
				content: "https://imposterworld.xyz/classroom-bg.jpg"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://imposterworld.xyz/imposter-word-list"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./notice-board-6XZeQfzx.mjs");
var Route$4 = createFileRoute("/notice-board")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./privacy-De9A_CLl.mjs");
var Route$3 = createFileRoute("/privacy")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./support-CF6xcI_6.mjs");
var Route$2 = createFileRoute("/support")({
	head: () => ({ meta: [
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
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./terms-DGJXOJy4.mjs");
var Route$1 = createFileRoute("/terms")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./api.auth.google.callback-4QVqZRFV.mjs");
var Route = createFileRoute("/api/auth/google/callback")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$13.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$14
	}),
	AdminRoute: Route$12.update({
		id: "/admin",
		path: "/admin",
		getParentRoute: () => Route$14
	}),
	DeleteAccountRoute: Route$11.update({
		id: "/delete-account",
		path: "/delete-account",
		getParentRoute: () => Route$14
	}),
	FaqRoute: Route$10.update({
		id: "/faq",
		path: "/faq",
		getParentRoute: () => Route$14
	}),
	HowToPlayRoute: Route$9.update({
		id: "/how-to-play",
		path: "/how-to-play",
		getParentRoute: () => Route$14
	}),
	ImposterGameOnlineRoute: Route$8.update({
		id: "/imposter-game-online",
		path: "/imposter-game-online",
		getParentRoute: () => Route$14
	}),
	ImposterGameQuestionsRoute: Route$7.update({
		id: "/imposter-game-questions",
		path: "/imposter-game-questions",
		getParentRoute: () => Route$14
	}),
	ImposterGameWithFriendsRoute: Route$6.update({
		id: "/imposter-game-with-friends",
		path: "/imposter-game-with-friends",
		getParentRoute: () => Route$14
	}),
	ImposterWordListRoute: Route$5.update({
		id: "/imposter-word-list",
		path: "/imposter-word-list",
		getParentRoute: () => Route$14
	}),
	NoticeBoardRoute: Route$4.update({
		id: "/notice-board",
		path: "/notice-board",
		getParentRoute: () => Route$14
	}),
	PrivacyRoute: Route$3.update({
		id: "/privacy",
		path: "/privacy",
		getParentRoute: () => Route$14
	}),
	SupportRoute: Route$2.update({
		id: "/support",
		path: "/support",
		getParentRoute: () => Route$14
	}),
	TermsRoute: Route$1.update({
		id: "/terms",
		path: "/terms",
		getParentRoute: () => Route$14
	}),
	ApiAuthGoogleCallbackRoute: Route.update({
		id: "/api/auth/google/callback",
		path: "/api/auth/google/callback",
		getParentRoute: () => Route$14
	})
};
var routeTree = Route$14._addFileChildren(rootRouteChildren)._addFileTypes();
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
