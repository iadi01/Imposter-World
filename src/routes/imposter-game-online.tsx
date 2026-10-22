import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Play, Users, Globe, Shield, Sparkles, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/imposter-game-online")({
  head: () => ({
    meta: [
      { title: "Play Imposter Game Online Free — No Download Required | Imposter World" },
      {
        name: "description",
        content:
          "Play the best online Imposter word game directly in your browser. Join friends with a secret room code or play instantly. No download or app install needed.",
      },
      { name: "keywords", content: "imposter game online, play imposter online, online imposter game, free imposter game no download, imposter browser game" },
      { property: "og:title", content: "Play Imposter Game Online Free — Imposter World" },
      { property: "og:description", content: "Jump into real-time classroom deduction word game with friends online. Free and works on phone and PC." },
      { property: "og:image", content: "https://imposterworld.xyz/classroom-bg.jpg" },
    ],
    links: [
      { rel: "canonical", href: "https://imposterworld.xyz/imposter-game-online" },
    ],
  }),
  component: ImposterGameOnlinePage,
});

function ImposterGameOnlinePage() {
  return (
    <main className="min-h-screen px-3 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm font-hand text-muted-foreground">
          <Link to="/" className="text-primary hover:underline flex items-center gap-1 font-bold">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
          <span>/</span>
          <span className="text-foreground font-bold">Imposter Game Online</span>
        </nav>

        {/* Notebook Content Sheet */}
        <article className="notebook relative p-6 sm:p-10 shadow-lg space-y-6 font-hand text-foreground leading-relaxed">
          <div className="tape absolute -top-3 left-1/2 h-6 w-36 -translate-x-1/2 rotate-[-1deg]" />

          <header className="border-b-2 border-foreground/20 pb-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-block bg-accent text-accent-foreground px-2.5 py-0.5 rounded text-xs font-bold">
                  Browser Edition · Zero Install
                </span>
                <h1 className="text-3xl sm:text-5xl font-display text-foreground font-bold">
                  Play Imposter Game Online
                </h1>
                <p className="text-base sm:text-lg text-primary font-bold">
                  Instant multiplayer deduction word party game. Works on iPhone, Android, Tablet & PC.
                </p>
              </div>
              <img
                src="/detective-waving.png"
                alt="Detective Waving"
                className="h-20 w-20 sm:h-24 sm:w-24 object-contain self-start sm:self-auto shrink-0 drop-shadow-md"
              />
            </div>
          </header>

          {/* Quick Action CTA Box */}
          <div className="p-4 sm:p-6 bg-primary/10 rounded-xl border-2 border-primary/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xl font-display font-bold text-foreground">Ready to start a game?</div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Create a secret 6-letter room code and send it to your friends over WhatsApp or Discord.
              </p>
            </div>
            <Link
              to="/"
              className="sketch flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 font-bold hover:brightness-110 shrink-0 text-base shadow-md"
            >
              <Play className="h-5 w-5 fill-current" /> Play Online Now
            </Link>
          </div>

          {/* Section 1: Why Play Imposter Game Online */}
          <section className="space-y-3 pt-2">
            <h2 className="text-2xl font-display font-bold text-foreground">
              Why Imposter World is the Best Online Imposter Word Game
            </h2>
            <p className="text-sm sm:text-base">
              Traditional party games require paper chits, timers, and sitting in the exact same room. <strong>Imposter World</strong> brings the classic pen-and-paper social deduction game to the web with <strong>100% anti-cheat servers</strong>, real-time drawing whiteboards, voice audio clues, and automated voting.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-muted/40 rounded-lg border border-foreground/20 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-primary text-sm">
                  <Globe className="h-4 w-4" /> 100% No Download
                </div>
                <p className="text-xs text-muted-foreground">
                  Runs directly inside Chrome, Safari, Edge, or Firefox. No app stores, zero memory footprint.
                </p>
              </div>

              <div className="p-3 bg-muted/40 rounded-lg border border-foreground/20 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-accent text-sm">
                  <Users className="h-4 w-4" /> 3 to 14 Players
                </div>
                <p className="text-xs text-muted-foreground">
                  Perfect for classroom friends, office game nights, Discord voice calls, and family gatherings.
                </p>
              </div>

              <div className="p-3 bg-muted/40 rounded-lg border border-foreground/20 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-foreground text-sm">
                  <Shield className="h-4 w-4" /> Anti-Cheat Server
                </div>
                <p className="text-xs text-muted-foreground">
                  Secret words are kept in cryptographically secure session memory so no inspect-element cheating is possible.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Online Game Modes */}
          <section className="space-y-3 pt-2">
            <h2 className="text-2xl font-display font-bold text-foreground">Online Game Modes Available</h2>
            <ul className="space-y-2 text-sm sm:text-base">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong>Private Room with Friends:</strong> Generate a unique 6-character room code (e.g. <span className="font-mono font-bold bg-muted px-1.5 py-0.5 rounded">#K7M9P2</span>) and invite your group.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <strong>Public Classroom Matchmaking:</strong> Browse public game rooms and jump into an active game with other detectives online.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-foreground shrink-0 mt-0.5" />
                <div>
                  <strong>Local Pass & Play:</strong> Gather 2 to 10 friends around a single phone or tablet and pass it around the desk!
                </div>
              </li>
            </ul>
          </section>

          {/* Internal SEO Links */}
          <footer className="border-t border-foreground/20 pt-4 mt-6 text-xs sm:text-sm text-muted-foreground flex flex-wrap gap-3">
            <span>Explore more:</span>
            <Link to="/how-to-play" className="text-primary underline font-bold">How To Play Guide</Link>
            <span>·</span>
            <Link to="/imposter-game-with-friends" className="text-primary underline font-bold">Play With Friends</Link>
            <span>·</span>
            <Link to="/imposter-word-list" className="text-primary underline font-bold">Word List & Pairs</Link>
            <span>·</span>
            <Link to="/faq" className="text-primary underline font-bold">FAQ</Link>
          </footer>
        </article>
      </div>
    </main>
  );
}
