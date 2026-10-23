import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Pin, Bell, Trophy, Mic, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { API_BASE } from "../lib/api";

export const Route = createFileRoute("/notice-board")({
  component: NoticeBoardPage,
});

function NoticeBoardPage() {
  const [championName, setChampionName] = useState<string>("Loading...");

  useEffect(() => {
    fetch(`${API_BASE}/api/leaderboard/champion`)
      .then((r) => r.json())
      .then((d) => {
        if (d && d.success && d.champion) {
          setChampionName(d.champion.name);
        } else {
          setChampionName("Top Detective");
        }
      })
      .catch(() => {
        setChampionName("Top Detective");
      });
  }, []);
  return (
    <main className="min-h-screen px-3 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm font-hand text-muted-foreground">
          <Link to="/" className="text-primary hover:underline flex items-center gap-1 font-bold">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
          <span>/</span>
          <span className="text-foreground font-bold">Notice Board</span>
        </nav>

        {/* Notebook Paper Sheet */}
        <article className="notebook relative p-4 sm:p-8 md:p-10 shadow-lg space-y-6 font-hand text-foreground leading-relaxed">
          <div className="tape absolute -top-3 left-1/2 h-6 w-36 -translate-x-1/2 rotate-[-1deg]" />

          <header className="border-b-2 border-foreground/20 pb-4 space-y-2">
            <span className="inline-block bg-highlight px-2.5 py-0.5 rounded text-xs font-bold border border-foreground/30">
              📌 Official Bulletins
            </span>
            <h1 className="text-4xl sm:text-5xl font-display text-foreground font-bold flex items-center gap-2">
              Classroom Notice Board
            </h1>
            <p className="text-lg text-primary font-bold">
              Class announcements, patch updates, and competitive tournament notices.
            </p>
            <p className="text-xs text-muted-foreground">
              Pinned by Classroom Monitor: Adi · Last updated 21 October 2026
            </p>
          </header>

          <section className="space-y-4">
            {/* Tournament Desk */}
            <div className="sketch bg-[#EBF3FF] p-5 space-y-2 border-2 border-primary shadow-xs relative">
              <div className="tape absolute -top-2 left-6 h-4 w-20 rotate-[-2deg]" />
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded">TOURNAMENT</span>
                <span className="text-muted-foreground">Every Wednesday</span>
              </div>
              <h3 className="text-2xl font-display font-bold text-primary flex items-center gap-2">
                <Trophy className="h-5 w-5 text-accent" /> Tournament Desk 🏆
              </h3>
              <p className="text-sm">
                <strong>Next one today (Wed):</strong> Top detectives clash in the 8-player bracket!
              </p>
              <div className="rounded bg-white/90 p-2.5 text-xs font-bold text-accent border border-accent/20">
                👑 {championName} currently holds the championship belt!
              </div>
            </div>

            {/* Notice 1 */}
            <div className="sketch bg-white/95 p-5 space-y-2 border-2 border-accent shadow-xs relative">
              <div className="tape absolute -top-2 left-6 h-4 w-20 rotate-[-3deg]" />
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded">NEW FEATURE</span>
                <span className="text-muted-foreground">21 Oct 2026</span>
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
                <Mic className="h-5 w-5 text-accent" /> Live Voice Hints Now Active!
              </h3>
              <p className="text-sm">
                Students can now speak their clues out loud! On your hint turn, tap <strong>"Voice Clue 🎙️"</strong> to record a crisp audio clip or live speech transcript. Classmates can tap the audio cassette on the pinboard to listen to your clue in real-time.
              </p>
            </div>

            {/* Notice 2 */}
            <div className="sketch bg-white/90 p-5 space-y-2 border border-foreground/30 shadow-xs relative">
              <div className="tape absolute -top-2 left-6 h-4 w-20 rotate-[2deg]" />
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded">GAMEPLAY</span>
                <span className="text-muted-foreground">20 Oct 2026</span>
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground">
                🎨 Paint Bucket & Flood Fill in Drawing Pad
              </h3>
              <p className="text-sm">
                The drawing canvas now includes a fast flood-fill Paint Bucket tool with 1-click Undo! Color large areas of your sketch instantly to give faster and more expressive hints.
              </p>
            </div>

            {/* Notice 3 */}
            <div className="sketch bg-white/90 p-5 space-y-2 border border-foreground/30 shadow-xs relative">
              <div className="tape absolute -top-2 left-6 h-4 w-20 rotate-[-1deg]" />
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="bg-highlight px-2 py-0.5 rounded text-foreground font-bold border border-foreground/30">RANKINGS</span>
                <span className="text-muted-foreground">19 Oct 2026</span>
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
                <Trophy className="h-5 w-5 text-accent" /> 3-Tier Leaderboards (Global, Country & State)
              </h3>
              <p className="text-sm">
                Compete against players worldwide, across India, or within your home state (Maharashtra, Delhi, Karnataka, etc.)! Track total wins, detective accuracy, and imposter survival rates.
              </p>
            </div>

            {/* Notice 4 */}
            <div className="sketch bg-white/90 p-5 space-y-2 border border-foreground/30 shadow-xs relative">
              <div className="tape absolute -top-2 left-6 h-4 w-20 rotate-[1deg]" />
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="bg-secondary px-2 py-0.5 rounded text-foreground font-bold border border-foreground/30">SECURITY</span>
                <span className="text-muted-foreground">18 Oct 2026</span>
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" /> Multi-Tab Self-Join Prevention
              </h3>
              <p className="text-sm">
                Fair play is strictly enforced. The game engine now prevents players from accidentally joining their own room twice across multiple tabs, guaranteeing authentic social deduction matches.
              </p>
            </div>
          </section>

          {/* Bottom Related Navigation */}
          <footer className="border-t-2 border-foreground/20 pt-6 flex flex-wrap gap-3 text-xs sm:text-sm font-bold text-primary">
            <Link to="/" className="hover:underline">Play Imposter World</Link>
            <span>•</span>
            <Link to="/how-to-play" className="hover:underline">How To Play</Link>
            <span>•</span>
            <Link to="/terms" className="hover:underline">Terms of Use</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
            <span>•</span>
            <Link to="/support" className="hover:underline">Support the Dev</Link>
            <span>•</span>
            <Link to="/delete-account" className="hover:underline">Delete Account</Link>
          </footer>
        </article>
      </div>
    </main>
  );
}
