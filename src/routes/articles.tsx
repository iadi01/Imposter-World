import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Search, Download, Check, Sparkles, Trophy, Lightbulb, Shield, Heart } from "lucide-react";
import { useMemo, useState } from "react";
import { ARTICLES, CATEGORIES, type Article } from "../lib/articles-data";

const SITE_URL = "https://imposter-world.onrender.com";

export const Route = createFileRoute("/articles")({
  head: () => ({
    meta: [
      { title: "Game Articles & Strategy Guides — Imposter World" },
      {
        name: "description",
        content:
          "Official Imposter World Strategy Observatory: Free guides, deduction masterclasses, imposter bluffing playbooks, word pair analyses, and party rules.",
      },
      {
        name: "keywords",
        content:
          "imposter game strategy, how to play imposter game, imposter bluffing guide, detective deduction tips, imposter world articles, party word game strategies, pass and play rules",
      },
      { property: "og:title", content: "Game Articles & Strategy Guides — Imposter World" },
      { property: "og:description", content: "Master social deduction with free strategy guides, imposter bluffing tips, and detective rules." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/articles` },
      { property: "og:image", content: `${SITE_URL}/classroom-bg.jpg` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Game Articles & Strategy Guides — Imposter World" },
      { name: "twitter:description", content: "Master social deduction with free strategy guides, imposter bluffing tips, and detective rules." },
      { name: "twitter:image", content: `${SITE_URL}/classroom-bg.jpg` },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/articles` }],
    scripts: [
      {
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
              description:
                "Official strategy observatory for Imposter World. Guides on clue formulating, deception detection, bluffing tactics, and party game modes.",
              publisher: {
                "@type": "Organization",
                name: "Imposter World",
                url: SITE_URL,
                logo: { "@type": "ImageObject", url: `${SITE_URL}/detective.png` },
              },
              hasPart: ARTICLES.slice(0, 50).map((a) => ({
                "@type": "Article",
                headline: a.title,
                author: { "@type": "Person", name: a.author },
                datePublished: a.date,
                articleSection: a.category,
                description: a.summary,
                url: `${SITE_URL}/articles#${a.id}`,
              })),
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
                name: a.title,
              })),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
                { "@type": "ListItem", position: 2, name: "Articles", item: `${SITE_URL}/articles` },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: ArticlesPage,
});

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function buildArticleHtml(a: Article) {
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
<footer>Imposter World · imposter-world.onrender.com · Classroom Detective Gazette · ${new Date().getFullYear()}</footer>
</body></html>`;
}

function downloadArticle(a: Article) {
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
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function ArticlesPage() {
  const [cat, setCat] = useState<string>("All");
  const [q, setQ] = useState("");
  const [active, setActive] = useState<Article | null>(null);
  const [page, setPage] = useState<number>(1);
  const PAGE_SIZE = 12;

  const filtered = useMemo(
    () =>
      ARTICLES.filter((a) => {
        const okC = cat === "All" || a.category === cat;
        const s = q.toLowerCase();
        const okS =
          !s ||
          a.title.toLowerCase().includes(s) ||
          a.summary.toLowerCase().includes(s) ||
          a.author.toLowerCase().includes(s) ||
          a.category.toLowerCase().includes(s);
        return okC && okS;
      }),
    [cat, q]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const handleFilterChange = (newCat: string) => {
    setCat(newCat);
    setPage(1);
  };

  const handleSearchChange = (newQ: string) => {
    setQ(newQ);
    setPage(1);
  };

  return (
    <main className="min-h-screen px-3 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm font-hand text-muted-foreground">
          <Link to="/" className="text-primary hover:underline flex items-center gap-1 font-bold">
            <ArrowLeft className="h-4 w-4" /> Return to Classroom
          </Link>
          <span>/</span>
          <span className="text-foreground font-bold">Strategy Observatory & Articles</span>
        </nav>

        {/* Notebook Main Sheet */}
        <div className="notebook relative p-5 sm:p-8 md:p-10 shadow-xl space-y-8 font-hand text-foreground leading-relaxed">
          <div className="tape absolute -top-4 left-1/2 h-7 w-40 -translate-x-1/2 rotate-[-1deg]" />

          {/* Header Banner */}
          <header className="border-b-2 border-foreground/20 pb-6 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-block bg-highlight px-3 py-0.5 rounded text-xs font-bold border border-foreground/30 uppercase tracking-wider">
                📰 Classroom Detective Gazette
              </span>
              <span className="text-xs text-muted-foreground font-bold">
                · {ARTICLES.length} Strategy Masterclasses · 100% Free
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-foreground leading-tight">
              Game Strategy & <span className="text-primary">Deduction Articles.</span>
            </h1>
            <p className="text-sm sm:text-base text-foreground/85 max-w-2xl leading-relaxed">
              Explore tactical guides, psychological deception tells, imposter bluffing playbooks, and offline pass-and-play strategies curated by top classroom detectives.
            </p>
          </header>

          {/* Search & Filter Toolbar */}
          <div className="sketch bg-[#FFFBEA] p-4 sm:p-5 border-2 border-foreground/30 shadow-sm space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-center">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={q}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={`Search ${ARTICLES.length} strategy guides (e.g. bluffing, clues, tells, word pairs)...`}
                  className="sketch w-full bg-white pl-9 pr-3 py-2 text-xs sm:text-sm font-bold focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-1.5 justify-start md:justify-end">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => handleFilterChange(c)}
                    className={`sketch px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                      cat === c
                        ? "bg-primary text-primary-foreground shadow-[2px_2px_0_0_rgba(0,0,0,1)] scale-[1.02]"
                        : "bg-white text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-muted-foreground font-bold flex items-center justify-between">
              <span>
                Showing {paginatedArticles.length} of {filtered.length} strategy guides (Page {currentPage} of {totalPages})
              </span>
              <span className="text-primary font-bold">✓ Open Access</span>
            </div>
          </div>

          {/* Flagship Featured Masterclass */}
          {currentPage === 1 && filtered[0] && (
            <article className="sketch relative bg-[#EBF3FF] p-6 sm:p-8 border-2 border-primary shadow-[4px_4px_0_0_rgba(37,99,235,1)] space-y-4">
              <div className="tape absolute -top-3 right-8 h-5 w-24 rotate-[2deg]" />
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-primary">
                <span className="bg-primary text-primary-foreground px-2.5 py-0.5 rounded uppercase tracking-wider text-[11px]">
                  ⭐ Featured Masterclass
                </span>
                <span>By {filtered[0].author} · {filtered[0].date} · {filtered[0].readTime}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground leading-snug">
                {filtered[0].title}
              </h2>

              <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
                {filtered[0].summary}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActive(filtered[0])}
                  className="sketch bg-primary text-primary-foreground px-5 py-2 text-xs sm:text-sm font-bold hover:brightness-110 flex items-center gap-1.5 shadow-[2px_2px_0_0_rgba(0,0,0,1)] cursor-pointer"
                >
                  <BookOpen className="h-4 w-4" /> Read Complete Guide →
                </button>
                <button
                  onClick={() => downloadArticle(filtered[0])}
                  className="sketch bg-white text-foreground px-4 py-2 text-xs sm:text-sm font-bold border-2 border-foreground/30 hover:bg-muted flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="h-4 w-4" /> ↓ Download Copy
                </button>
              </div>
            </article>
          )}

          {/* Grid of Strategy Articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedArticles.map((a) => (
              <article
                key={a.id}
                id={a.id}
                className="sketch bg-white/90 p-5 border-2 border-foreground/30 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="bg-highlight px-2 py-0.5 rounded font-bold uppercase text-[10px] border border-foreground/20">
                      {a.category}
                    </span>
                    <span className="text-muted-foreground font-bold text-[11px]">{a.readTime}</span>
                  </div>

                  <h3 className="font-display text-lg sm:text-xl font-bold text-foreground leading-tight">
                    {a.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-foreground/75 leading-relaxed line-clamp-3">
                    {a.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-foreground/15 space-y-2">
                  <div className="text-[11px] text-muted-foreground">
                    By <strong>{a.author}</strong> · {a.date}
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      onClick={() => setActive(a)}
                      className="text-primary font-bold text-xs hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Read Guide →
                    </button>
                    <button
                      onClick={() => downloadArticle(a)}
                      className="text-xs text-muted-foreground hover:text-foreground font-bold flex items-center gap-1 cursor-pointer"
                      title="Download HTML file for offline reading"
                    >
                      <Download className="h-3 w-3" /> Save
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4 pb-2 font-hand">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="sketch px-3 py-1.5 text-xs sm:text-sm font-bold bg-white border-2 border-foreground/30 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-secondary cursor-pointer"
              >
                ← Previous
              </button>

              <span className="px-3 py-1.5 text-xs sm:text-sm font-bold bg-highlight border border-foreground/20 rounded">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="sketch px-3 py-1.5 text-xs sm:text-sm font-bold bg-white border-2 border-foreground/30 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-secondary cursor-pointer"
              >
                Next →
              </button>
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-16 space-y-2">
              <div className="text-4xl">🔍</div>
              <p className="font-display text-xl font-bold">No articles match your search.</p>
              <p className="text-xs text-muted-foreground">Try clearing your filters or searching another keyword.</p>
            </div>
          )}

          {/* Footer Backlink */}
          <footer className="pt-6 border-t-2 border-foreground/20 text-center space-y-2">
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-primary font-bold">
              <Link to="/" className="underline hover:text-accent">
                Play Imposter World
              </Link>
              <span>·</span>
              <Link to="/how-to-play" className="underline hover:text-accent">
                How To Play
              </Link>
              <span>·</span>
              <Link to="/notice-board" className="underline hover:text-accent">
                Notice Board
              </Link>
              <span>·</span>
              <Link to="/support" className="underline hover:text-accent">
                Support the Dev
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">
              made on the last bench by adi · Imposter World
            </p>
          </footer>
        </div>
      </div>

      {/* Interactive Modal Reader */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs font-hand"
          onClick={() => setActive(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="notebook relative max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-4 border-foreground space-y-5 max-h-[90vh] overflow-y-auto"
          >
            <div className="tape absolute -top-4 left-1/2 h-6 w-36 -translate-x-1/2 rotate-[-2deg]" />

            <button
              onClick={() => setActive(null)}
              className="sketch absolute top-3 right-3 bg-secondary px-3 py-1 text-xs font-bold text-foreground hover:bg-secondary/80 cursor-pointer"
            >
              Close ✕
            </button>

            <div className="space-y-1">
              <span className="bg-primary text-primary-foreground px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                {active.category} · Strategy Masterclass
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground leading-tight pt-1">
                {active.title}
              </h2>
              <div className="text-xs text-muted-foreground pb-2 border-b border-foreground/15">
                Author: <strong>{active.author}</strong> · Published: {active.date} · {active.readTime}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-base font-bold text-primary uppercase tracking-wide">
                Executive Summary
              </h3>
              <p className="text-sm text-foreground/85 leading-relaxed bg-[#FFFBEA] p-3 border border-foreground/20 rounded">
                {active.summary}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-base font-bold text-primary uppercase tracking-wide">
                Strategy Abstract
              </h3>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {active.abstract}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-base font-bold text-primary uppercase tracking-wide">
                Key Actionable Rules & Findings
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-foreground/85">
                {active.keyFindings.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 bg-white/70 p-2.5 border border-foreground/15 rounded">
                    <span className="text-green-600 font-bold shrink-0">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-foreground/15 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground font-bold">
                100% Free Classroom Playbook
              </span>
              <button
                onClick={() => downloadArticle(active)}
                className="sketch bg-primary text-primary-foreground px-5 py-2 text-xs font-bold hover:brightness-110 flex items-center gap-1.5 shadow-[2px_2px_0_0_rgba(0,0,0,1)] cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" /> ↓ Save HTML Copy Offline
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
