import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { G as Download, rt as ArrowLeft, tt as BookOpen, v as Search } from "../_libs/lucide-react.mjs";
import { n as CATEGORIES, t as ARTICLES } from "./articles-data-BkRX9pQa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/articles-GptQ7MTU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/Users/aadi/Downloads/f8225c15-5378-482e-bfe4-be001f84d384/src/routes/articles.tsx?tsr-split=component";
function escapeHtml(s) {
	return s.replace(/[&<>"']/g, (c) => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#39;"
	})[c]);
}
function buildArticleHtml(a) {
	const findings = a.keyFindings.map((f) => `<li>${escapeHtml(f)}</li>`).join("");
	return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(a.title)} — Imposter World Strategy Observatory</title>
<meta name="description" content="${escapeHtml(a.summary)}" />
<meta name="author" content="${escapeHtml(a.author)}" />
<style>
  body{font-family:'Caveat Brush',Georgia,serif;max-width:780px;margin:40px auto;padding:0 24px;color:#1e293b;background:#FFFBF0;line-height:1.6}
  h1{font-size:28px;border-bottom:2px solid #2563eb;padding-bottom:12px;color:#1e3a8a}
  h2{font-size:18px;color:#2563eb;margin-top:28px;text-transform:uppercase;letter-spacing:1px}
  .meta{color:#64748b;font-size:13px;margin:8px 0 20px;text-transform:uppercase;letter-spacing:1px}
  .cat{display:inline-block;background:#1e3a8a;color:#fff;padding:4px 10px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;border-radius:4px}
  ul{padding-left:24px}
  li{margin:10px 0}
  footer{margin-top:50px;border-top:1px solid #cbd5e1;padding-top:16px;font-size:12px;color:#64748b;text-align:center}
</style>
</head>
<body>
<span class="cat">${escapeHtml(a.category)}</span>
<h1>${escapeHtml(a.title)}</h1>
<div class="meta">By ${escapeHtml(a.author)} · Published ${escapeHtml(a.date)} · ${escapeHtml(a.readTime)}</div>
<h2>Summary</h2>
<p>${escapeHtml(a.summary)}</p>
<h2>Strategy Abstract</h2>
<p>${escapeHtml(a.abstract)}</p>
<h2>Key Actionable Rules</h2>
<ul>${findings}</ul>
<footer>Imposter World · imposter-world.onrender.com · Classroom Detective Gazette · ${(/* @__PURE__ */ new Date()).getFullYear()}</footer>
</body></html>`;
}
function downloadArticle(a) {
	const html = buildArticleHtml(a);
	const blob = new Blob([html], { type: "text/html;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = `${a.id}_imposter_world_strategy.html`;
	link.rel = "noopener";
	document.body.appendChild(link);
	link.click();
	link.remove();
	setTimeout(() => URL.revokeObjectURL(url), 1e3);
}
function ArticlesPage() {
	const [cat, setCat] = (0, import_react.useState)("All");
	const [q, setQ] = (0, import_react.useState)("");
	const [active, setActive] = (0, import_react.useState)(null);
	const [page, setPage] = (0, import_react.useState)(1);
	const PAGE_SIZE = 12;
	const filtered = (0, import_react.useMemo)(() => ARTICLES.filter((a) => {
		const okC = cat === "All" || a.category === cat;
		const s = q.toLowerCase();
		const okS = !s || a.title.toLowerCase().includes(s) || a.summary.toLowerCase().includes(s) || a.author.toLowerCase().includes(s) || a.category.toLowerCase().includes(s);
		return okC && okS;
	}), [cat, q]);
	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const currentPage = Math.min(page, totalPages);
	const paginatedArticles = (0, import_react.useMemo)(() => {
		const start = (currentPage - 1) * PAGE_SIZE;
		return filtered.slice(start, start + PAGE_SIZE);
	}, [filtered, currentPage]);
	const handleFilterChange = (newCat) => {
		setCat(newCat);
		setPage(1);
	};
	const handleSearchChange = (newQ) => {
		setQ(newQ);
		setPage(1);
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
		className: "min-h-screen px-3 py-6 md:px-8 md:py-10",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mx-auto max-w-5xl space-y-6",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", {
				className: "flex items-center gap-2 text-sm font-hand text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: "/",
						className: "text-primary hover:underline flex items-center gap-1 font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowLeft, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 93,
							columnNumber: 13
						}, this), " Return to Classroom"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 92,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "/" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 95,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-foreground font-bold",
						children: "Strategy Observatory & Articles"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 96,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 91,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "notebook relative p-5 sm:p-8 md:p-10 shadow-xl space-y-8 font-hand text-foreground leading-relaxed",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "tape absolute -top-4 left-1/2 h-7 w-40 -translate-x-1/2 rotate-[-1deg]" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 101,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
						className: "border-b-2 border-foreground/20 pb-6 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "inline-block bg-highlight px-3 py-0.5 rounded text-xs font-bold border border-foreground/30 uppercase tracking-wider",
									children: "📰 Classroom Detective Gazette"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 106,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-xs text-muted-foreground font-bold",
									children: [
										"· ",
										ARTICLES.length,
										" Strategy Masterclasses · 100% Free"
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 109,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 105,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
								className: "text-3xl sm:text-5xl font-display font-bold text-foreground leading-tight",
								children: ["Game Strategy & ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-primary",
									children: "Deduction Articles."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 114,
									columnNumber: 31
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 113,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-sm sm:text-base text-foreground/85 max-w-2xl leading-relaxed",
								children: "Explore tactical guides, psychological deception tells, imposter bluffing playbooks, and offline pass-and-play strategies curated by top classroom detectives."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 116,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 104,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "sketch bg-[#FFFBEA] p-4 sm:p-5 border-2 border-foreground/30 shadow-sm space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-center",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 125,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
									type: "text",
									value: q,
									onChange: (e) => handleSearchChange(e.target.value),
									placeholder: `Search ${ARTICLES.length} strategy guides (e.g. bluffing, clues, tells, word pairs)...`,
									className: "sketch w-full bg-white pl-9 pr-3 py-2 text-xs sm:text-sm font-bold focus:outline-none"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 126,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 124,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex flex-wrap gap-1.5 justify-start md:justify-end",
								children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
									onClick: () => handleFilterChange(c),
									className: `sketch px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${cat === c ? "bg-primary text-primary-foreground shadow-[2px_2px_0_0_rgba(0,0,0,1)] scale-[1.02]" : "bg-white text-muted-foreground hover:text-foreground"}`,
									children: c
								}, c, false, {
									fileName: _jsxFileName,
									lineNumber: 130,
									columnNumber: 38
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 129,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 123,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-[11px] text-muted-foreground font-bold flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
								"Showing ",
								paginatedArticles.length,
								" of ",
								filtered.length,
								" strategy guides (Page ",
								currentPage,
								" of ",
								totalPages,
								")"
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 137,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-primary font-bold",
								children: "✓ Open Access"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 140,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 136,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 122,
						columnNumber: 11
					}, this),
					currentPage === 1 && filtered[0] && /* @__PURE__ */ (void 0)("article", {
						className: "sketch relative bg-[#EBF3FF] p-6 sm:p-8 border-2 border-primary shadow-[4px_4px_0_0_rgba(37,99,235,1)] space-y-4",
						children: [
							/* @__PURE__ */ (void 0)("div", { className: "tape absolute -top-3 right-8 h-5 w-24 rotate-[2deg]" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 146,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-primary",
								children: [/* @__PURE__ */ (void 0)("span", {
									className: "bg-primary text-primary-foreground px-2.5 py-0.5 rounded uppercase tracking-wider text-[11px]",
									children: "⭐ Featured Masterclass"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 148,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("span", { children: [
									"By ",
									filtered[0].author,
									" · ",
									filtered[0].date,
									" · ",
									filtered[0].readTime
								] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 151,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 147,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("h2", {
								className: "text-2xl sm:text-3xl font-display font-bold text-foreground leading-snug",
								children: filtered[0].title
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 154,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("p", {
								className: "text-sm sm:text-base text-foreground/80 leading-relaxed",
								children: filtered[0].summary
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 158,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "pt-2 flex flex-wrap items-center gap-3",
								children: [/* @__PURE__ */ (void 0)("button", {
									onClick: () => setActive(filtered[0]),
									className: "sketch bg-primary text-primary-foreground px-5 py-2 text-xs sm:text-sm font-bold hover:brightness-110 flex items-center gap-1.5 shadow-[2px_2px_0_0_rgba(0,0,0,1)] cursor-pointer",
									children: [/* @__PURE__ */ (void 0)(BookOpen, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 164,
										columnNumber: 19
									}, this), " Read Complete Guide →"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 163,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("button", {
									onClick: () => downloadArticle(filtered[0]),
									className: "sketch bg-white text-foreground px-4 py-2 text-xs sm:text-sm font-bold border-2 border-foreground/30 hover:bg-muted flex items-center gap-1.5 cursor-pointer",
									children: [/* @__PURE__ */ (void 0)(Download, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 167,
										columnNumber: 19
									}, this), " ↓ Download Copy"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 166,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 162,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 145,
						columnNumber: 48
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5",
						children: paginatedArticles.map((a) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", {
							id: a.id,
							className: "sketch bg-white/90 p-5 border-2 border-foreground/30 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-2.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center justify-between text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "bg-highlight px-2 py-0.5 rounded font-bold uppercase text-[10px] border border-foreground/20",
											children: a.category
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 177,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-muted-foreground font-bold text-[11px]",
											children: a.readTime
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 180,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 176,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
										className: "font-display text-lg sm:text-xl font-bold text-foreground leading-tight",
										children: a.title
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 183,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-xs sm:text-sm text-foreground/75 leading-relaxed line-clamp-3",
										children: a.summary
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 187,
										columnNumber: 19
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 175,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "pt-3 border-t border-foreground/15 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-[11px] text-muted-foreground",
									children: [
										"By ",
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: a.author }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 194,
											columnNumber: 24
										}, this),
										" · ",
										a.date
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 193,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center justify-between gap-2 pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										onClick: () => setActive(a),
										className: "text-primary font-bold text-xs hover:underline flex items-center gap-1 cursor-pointer",
										children: "Read Guide →"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 198,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										onClick: () => downloadArticle(a),
										className: "text-xs text-muted-foreground hover:text-foreground font-bold flex items-center gap-1 cursor-pointer",
										title: "Download HTML file for offline reading",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Download, { className: "h-3 w-3" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 202,
											columnNumber: 23
										}, this), " Save"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 201,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 197,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 192,
								columnNumber: 17
							}, this)]
						}, a.id, true, {
							fileName: _jsxFileName,
							lineNumber: 174,
							columnNumber: 41
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 173,
						columnNumber: 11
					}, this),
					totalPages > 1 && /* @__PURE__ */ (void 0)("div", {
						className: "flex flex-wrap items-center justify-center gap-2 pt-4 pb-2 font-hand",
						children: [
							/* @__PURE__ */ (void 0)("button", {
								type: "button",
								onClick: () => setPage((p) => Math.max(1, p - 1)),
								disabled: currentPage === 1,
								className: "sketch px-3 py-1.5 text-xs sm:text-sm font-bold bg-white border-2 border-foreground/30 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-secondary cursor-pointer",
								children: "← Previous"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 211,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("span", {
								className: "px-3 py-1.5 text-xs sm:text-sm font-bold bg-highlight border border-foreground/20 rounded",
								children: [
									"Page ",
									currentPage,
									" of ",
									totalPages
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 215,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("button", {
								type: "button",
								onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
								disabled: currentPage === totalPages,
								className: "sketch px-3 py-1.5 text-xs sm:text-sm font-bold bg-white border-2 border-foreground/30 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-secondary cursor-pointer",
								children: "Next →"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 219,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 210,
						columnNumber: 30
					}, this),
					filtered.length === 0 && /* @__PURE__ */ (void 0)("div", {
						className: "text-center py-16 space-y-2",
						children: [
							/* @__PURE__ */ (void 0)("div", {
								className: "text-4xl",
								children: "🔍"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 225,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("p", {
								className: "font-display text-xl font-bold",
								children: "No articles match your search."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 226,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("p", {
								className: "text-xs text-muted-foreground",
								children: "Try clearing your filters or searching another keyword."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 227,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 224,
						columnNumber: 37
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("footer", {
						className: "pt-6 border-t-2 border-foreground/20 text-center space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-primary font-bold",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/",
									className: "underline hover:text-accent",
									children: "Play Imposter World"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 233,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "·" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 236,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/how-to-play",
									className: "underline hover:text-accent",
									children: "How To Play"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 237,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "·" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 240,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/notice-board",
									className: "underline hover:text-accent",
									children: "Notice Board"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 241,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "·" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 244,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/support",
									className: "underline hover:text-accent",
									children: "Support the Dev"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 245,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 232,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-muted-foreground",
							children: "made on the last bench by adi · Imposter World"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 249,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 231,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 100,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 89,
			columnNumber: 7
		}, this), active && /* @__PURE__ */ (void 0)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs font-hand",
			onClick: () => setActive(null),
			children: /* @__PURE__ */ (void 0)("div", {
				onClick: (e) => e.stopPropagation(),
				className: "notebook relative max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-4 border-foreground space-y-5 max-h-[90vh] overflow-y-auto",
				children: [
					/* @__PURE__ */ (void 0)("div", { className: "tape absolute -top-4 left-1/2 h-6 w-36 -translate-x-1/2 rotate-[-2deg]" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 259,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (void 0)("button", {
						onClick: () => setActive(null),
						className: "sketch absolute top-3 right-3 bg-secondary px-3 py-1 text-xs font-bold text-foreground hover:bg-secondary/80 cursor-pointer",
						children: "Close ✕"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 261,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (void 0)("div", {
						className: "space-y-1",
						children: [
							/* @__PURE__ */ (void 0)("span", {
								className: "bg-primary text-primary-foreground px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider",
								children: [active.category, " · Strategy Masterclass"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 266,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("h2", {
								className: "text-2xl sm:text-3xl font-display font-bold text-foreground leading-tight pt-1",
								children: active.title
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 269,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "text-xs text-muted-foreground pb-2 border-b border-foreground/15",
								children: [
									"Author: ",
									/* @__PURE__ */ (void 0)("strong", { children: active.author }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 273,
										columnNumber: 25
									}, this),
									" · Published: ",
									active.date,
									" · ",
									active.readTime
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 272,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 265,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (void 0)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (void 0)("h3", {
							className: "font-display text-base font-bold text-primary uppercase tracking-wide",
							children: "Executive Summary"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 278,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)("p", {
							className: "text-sm text-foreground/85 leading-relaxed bg-[#FFFBEA] p-3 border border-foreground/20 rounded",
							children: active.summary
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 281,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 277,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (void 0)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (void 0)("h3", {
							className: "font-display text-base font-bold text-primary uppercase tracking-wide",
							children: "Strategy Abstract"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 287,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)("p", {
							className: "text-sm text-foreground/80 leading-relaxed",
							children: active.abstract
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 290,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 286,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (void 0)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (void 0)("h3", {
							className: "font-display text-base font-bold text-primary uppercase tracking-wide",
							children: "Key Actionable Rules & Findings"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 296,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)("ul", {
							className: "space-y-2 text-xs sm:text-sm text-foreground/85",
							children: active.keyFindings.map((f, i) => /* @__PURE__ */ (void 0)("li", {
								className: "flex items-start gap-2 bg-white/70 p-2.5 border border-foreground/15 rounded",
								children: [/* @__PURE__ */ (void 0)("span", {
									className: "text-green-600 font-bold shrink-0",
									children: "✓"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 301,
									columnNumber: 21
								}, this), /* @__PURE__ */ (void 0)("span", { children: f }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 302,
									columnNumber: 21
								}, this)]
							}, i, true, {
								fileName: _jsxFileName,
								lineNumber: 300,
								columnNumber: 51
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 299,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 295,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (void 0)("div", {
						className: "pt-3 border-t border-foreground/15 flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (void 0)("span", {
							className: "text-xs text-muted-foreground font-bold",
							children: "100% Free Classroom Playbook"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 308,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)("button", {
							onClick: () => downloadArticle(active),
							className: "sketch bg-primary text-primary-foreground px-5 py-2 text-xs font-bold hover:brightness-110 flex items-center gap-1.5 shadow-[2px_2px_0_0_rgba(0,0,0,1)] cursor-pointer",
							children: [/* @__PURE__ */ (void 0)(Download, { className: "h-3.5 w-3.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 312,
								columnNumber: 17
							}, this), " ↓ Save HTML Copy Offline"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 311,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 307,
						columnNumber: 13
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 258,
				columnNumber: 11
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 257,
			columnNumber: 18
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 88,
		columnNumber: 10
	}, this);
}
//#endregion
export { ArticlesPage as component };
