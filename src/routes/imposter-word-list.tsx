import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Play, BookOpen, Sparkles, Filter, Check } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/imposter-word-list")({
  head: () => ({
    meta: [
      { title: "Best Imposter Word List & Tricky Word Pairs | Imposter World" },
      {
        name: "description",
        content:
          "Browse 100+ clever and tricky Imposter word pairs for your game night. Categories include Bollywood, Cricket, Food & Drinks, Animals, Tech, and Places.",
      },
      { name: "keywords", content: "imposter word list, imposter words, imposter game word pairs, tricky imposter words, bollywood imposter words, cricket imposter words" },
      { property: "og:title", content: "Best Imposter Word List & Tricky Word Pairs — Imposter World" },
      { property: "og:description", content: "Discover 7,000+ verified lookalike word pairs that make bluffing fun and deceptive." },
      { property: "og:image", content: "https://imposter-world.onrender.com/classroom-bg.jpg" },
    ],
    links: [
      { rel: "canonical", href: "https://imposter-world.onrender.com/imposter-word-list" },
    ],
  }),
  component: ImposterWordListPage,
});

const WORD_PAIRS = [
  { category: "Food & Drinks", common: "Samosa", imposter: "Kachori", tip: "Both are fried Indian savory snacks, but samosa is triangular and kachori is round." },
  { category: "Food & Drinks", common: "Coffee", imposter: "Tea", tip: "Both are hot morning beverages with caffeine, tricky for subtle clues." },
  { category: "Food & Drinks", common: "Pizza", imposter: "Burger", tip: "Both are global fast-food staples with cheese and bread." },
  { category: "Food & Drinks", common: "Butter Chicken", imposter: "Paneer Butter Masala", tip: "Identical gravy texture and orange-red color, but one is vegetarian." },
  { category: "Cricket & Sports", common: "Virat Kohli", imposter: "Rohit Sharma", tip: "Both are Indian cricketing legends, top batsmen, and World Cup champions." },
  { category: "Cricket & Sports", common: "Cricket Bat", imposter: "Hockey Stick", tip: "Both are wooden sports equipment used to hit a ball." },
  { category: "Cricket & Sports", common: "IPL (Indian Premier League)", imposter: "World Cup", tip: "Both are massively watched cricket tournaments." },
  { category: "Bollywood & Cinema", common: "Shah Rukh Khan", imposter: "Salman Khan", tip: "Both are Bollywood superstars known as Badshah and Bhaijaan." },
  { category: "Bollywood & Cinema", common: "Sholay", imposter: "Deewaar", tip: "Classic 70s Amitabh Bachchan blockbusters with iconic dialogues." },
  { category: "Bollywood & Cinema", common: "Popcorn", imposter: "Nachos", tip: "Standard movie theater cinema snacks with cheese or butter." },
  { category: "Animals & Nature", common: "Lion", imposter: "Tiger", tip: "Apex feline predators, one hunts in prides while the other has stripes." },
  { category: "Animals & Nature", common: "Dolphin", imposter: "Shark", tip: "Ocean predators with fins, but dolphins are playful mammals." },
  { category: "Animals & Nature", common: "Crocodile", imposter: "Alligator", tip: "Ancient reptiles with snout differences that confuse almost everyone." },
  { category: "Technology & Gadgets", common: "iPhone", imposter: "Android", tip: "Smartphones with touchscreens, cameras, and app ecosystems." },
  { category: "Technology & Gadgets", common: "Laptop", imposter: "Tablet", tip: "Portable computing devices used for work and entertainment." },
  { category: "Technology & Gadgets", common: "Instagram", imposter: "Snapchat", tip: "Visual photo social apps famous for 24-hour disappearing stories." },
  { category: "Places & Travel", common: "Mumbai", imposter: "Delhi", tip: "Mega Indian cities with distinct street food and bustling metro systems." },
  { category: "Places & Travel", common: "Goa", imposter: "Manali", tip: "Top Indian holiday destinations, but one is beaches and the other snow." },
  { category: "Places & Travel", common: "Taj Mahal", imposter: "Qutub Minar", tip: "Historic white marble vs red sandstone UNESCO heritage landmarks." },
];

function ImposterWordListPage() {
  const [selectedCat, setSelectedCat] = useState("All");

  const categories = ["All", "Food & Drinks", "Cricket & Sports", "Bollywood & Cinema", "Animals & Nature", "Technology & Gadgets", "Places & Travel"];

  const filtered = selectedCat === "All" ? WORD_PAIRS : WORD_PAIRS.filter((p) => p.category === selectedCat);

  return (
    <main className="min-h-screen px-3 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm font-hand text-muted-foreground">
          <Link to="/" className="text-primary hover:underline flex items-center gap-1 font-bold">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
          <span>/</span>
          <span className="text-foreground font-bold">Imposter Word List</span>
        </nav>

        {/* Notebook Content Sheet */}
        <article className="notebook relative p-6 sm:p-10 shadow-lg space-y-6 font-hand text-foreground leading-relaxed">
          <div className="tape absolute -top-3 left-1/2 h-6 w-36 -translate-x-1/2 rotate-[-1deg]" />

          <header className="border-b-2 border-foreground/20 pb-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-block bg-highlight px-2.5 py-0.5 rounded text-xs font-bold border border-foreground/30">
                  7,800+ Verified Pairs Database
                </span>
                <h1 className="text-3xl sm:text-5xl font-display text-foreground font-bold">
                  Imposter Word List & Clever Pairs
                </h1>
                <p className="text-base sm:text-lg text-primary font-bold">
                  Curated tricky pairs designed to test your bluffing and deduction skills.
                </p>
              </div>
              <img
                src="/clue-magnifier.png"
                alt="Clue Magnifier"
                className="h-20 w-20 sm:h-24 sm:w-24 object-contain self-start sm:self-auto shrink-0 drop-shadow-md"
              />
            </div>
          </header>

          {/* Quick Play CTA */}
          <div className="p-4 bg-primary/10 rounded-xl border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-sm">
              <strong>Want to play these words in real-time?</strong> All 7,800+ pairs are built right into the free online game.
            </div>
            <Link
              to="/"
              className="sketch flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 font-bold hover:brightness-110 shrink-0 text-sm shadow-sm"
            >
              <Play className="h-4 w-4 fill-current" /> Play Word Game
            </Link>
          </div>

          {/* Category Filter Pills */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Filter by Category:</div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`sketch px-3 py-1 text-xs sm:text-sm font-bold transition-all ${
                    selectedCat === cat
                      ? "bg-foreground text-background"
                      : "bg-white/80 hover:bg-secondary text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Word Pairs Table / Cards */}
          <section className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filtered.map((item, idx) => (
                <div key={idx} className="p-3.5 bg-white/85 rounded-lg border-2 border-foreground/20 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold bg-muted px-2 py-0.5 rounded text-muted-foreground">
                      {item.category}
                    </span>
                    <span className="text-xs text-primary font-bold">Tricky Pair</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm pt-1">
                    <div className="p-2 bg-primary/10 rounded border border-primary/20">
                      <div className="text-[10px] text-muted-foreground uppercase font-bold">Majority Word</div>
                      <div className="font-display text-base font-bold text-primary">{item.common}</div>
                    </div>

                    <div className="p-2 bg-accent/15 rounded border border-accent/30">
                      <div className="text-[10px] text-muted-foreground uppercase font-bold">Imposter Word</div>
                      <div className="font-display text-base font-bold text-accent">{item.imposter}</div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-normal">
                    💡 <em>{item.tip}</em>
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Internal SEO Links */}
          <footer className="border-t border-foreground/20 pt-4 mt-6 text-xs sm:text-sm text-muted-foreground flex flex-wrap gap-3">
            <span>Explore more:</span>
            <Link to="/how-to-play" className="text-primary underline font-bold">How To Play</Link>
            <span>·</span>
            <Link to="/imposter-game-online" className="text-primary underline font-bold">Play Online</Link>
            <span>·</span>
            <Link to="/imposter-game-questions" className="text-primary underline font-bold">Questions & Hints</Link>
            <span>·</span>
            <Link to="/faq" className="text-primary underline font-bold">FAQ</Link>
          </footer>
        </article>
      </div>
    </main>
  );
}
