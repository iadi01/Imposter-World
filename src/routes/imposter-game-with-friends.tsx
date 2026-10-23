import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Play, Users, MessageSquare, Share2, HeartHandshake, Sparkles } from "lucide-react";

export const Route = createFileRoute("/imposter-game-with-friends")({
  head: () => ({
    meta: [
      { title: "Play Imposter Game With Friends — Online Multiplayer Party Game | Imposter World" },
      {
        name: "description",
        content:
          "Looking for a fun online party word game to play with friends? Start an Imposter World room for 3 to 14 players. Perfect for group calls, dorms, and party nights.",
      },
      { name: "keywords", content: "imposter game with friends, play imposter with friends, multiplayer imposter game, imposter game for parties, party word game online" },
      { property: "og:title", content: "Play Imposter Game With Friends Online — Imposter World" },
      { property: "og:description", content: "Create a private room in 5 seconds. Send the secret invite link to your friends and catch the imposter together!" },
      { property: "og:image", content: "https://imposter-world.onrender.com/classroom-bg.jpg" },
    ],
    links: [
      { rel: "canonical", href: "https://imposter-world.onrender.com/imposter-game-with-friends" },
    ],
  }),
  component: ImposterGameWithFriendsPage,
});

function ImposterGameWithFriendsPage() {
  return (
    <main className="min-h-screen px-3 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm font-hand text-muted-foreground">
          <Link to="/" className="text-primary hover:underline flex items-center gap-1 font-bold">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
          <span>/</span>
          <span className="text-foreground font-bold">Imposter Game With Friends</span>
        </nav>

        {/* Notebook Content Sheet */}
        <article className="notebook relative p-6 sm:p-10 shadow-lg space-y-6 font-hand text-foreground leading-relaxed">
          <div className="tape absolute -top-3 left-1/2 h-6 w-36 -translate-x-1/2 rotate-[-1deg]" />

          <header className="border-b-2 border-foreground/20 pb-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-block bg-primary text-primary-foreground px-2.5 py-0.5 rounded text-xs font-bold">
                  Party & Group Edition · 3-14 Players
                </span>
                <h1 className="text-3xl sm:text-5xl font-display text-foreground font-bold">
                  Play Imposter Game With Friends
                </h1>
                <p className="text-base sm:text-lg text-primary font-bold">
                  The ultimate social deduction word game for group chats, Discord hangouts, and house parties.
                </p>
              </div>
              <img
                src="/detective-drawing.png"
                alt="Detective Drawing"
                className="h-20 w-20 sm:h-24 sm:w-24 object-contain self-start sm:self-auto shrink-0 drop-shadow-md"
              />
            </div>
          </header>

          {/* Quick Action Box */}
          <div className="p-4 sm:p-6 bg-accent/15 rounded-xl border-2 border-accent/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xl font-display font-bold text-foreground">Create a Friends Room in 5 Seconds</div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Hit the button below, copy your private invite link, and paste it into your WhatsApp group or Discord server.
              </p>
            </div>
            <Link
              to="/"
              className="sketch flex items-center gap-2 bg-accent text-accent-foreground px-5 py-2.5 font-bold hover:brightness-110 shrink-0 text-base shadow-md"
            >
              <Users className="h-5 w-5" /> Start Friends Game
            </Link>
          </div>

          {/* How to Play with Friends Guide */}
          <section className="space-y-4 pt-2">
            <h2 className="text-2xl font-display font-bold text-foreground">
              How to Host an Imposter Game Night With Your Group
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg border border-foreground/20 space-y-2">
                <div className="text-3xl font-display font-bold text-primary">01</div>
                <div className="font-bold text-foreground">Create Private Room</div>
                <p className="text-xs text-muted-foreground">
                  Choose your game settings: turn timer duration (30s to 90s), drawing clue pads, voice clues, or text only.
                </p>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg border border-foreground/20 space-y-2">
                <div className="text-3xl font-display font-bold text-accent">02</div>
                <div className="font-bold text-foreground">Share Secret Code</div>
                <p className="text-xs text-muted-foreground">
                  One-tap link sharing allows your friends to join instantly without having to register or download anything.
                </p>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg border border-foreground/20 space-y-2">
                <div className="text-3xl font-display font-bold text-foreground">03</div>
                <div className="font-bold text-foreground">Bluff & Interrogate</div>
                <p className="text-xs text-muted-foreground">
                  Everyone gives a clue one-by-one. Watch who pauses suspiciously, who gives vague hints, and cast your votes!
                </p>
              </div>
            </div>
          </section>

          {/* Tips for Big Groups */}
          <section className="space-y-3 pt-2">
            <h2 className="text-2xl font-display font-bold text-foreground">Pro Tips for Friends & Parties</h2>
            <ul className="space-y-2 text-sm sm:text-base list-disc list-inside text-foreground/90">
              <li><strong>Don't be too specific:</strong> If your secret word is "Guitar", saying "It has 6 strings" gives it away to the Imposter immediately. Instead say "Wood and rhythm".</li>
              <li><strong>If you are the Imposter:</strong> Stay calm! Pick an ambiguous hint like "Found in common rooms" or repeat a theme from earlier hints without copying word-for-word.</li>
              <li><strong>Use Voice & Drawing:</strong> Turn on the Sketchpad to draw quick doodles, or press the vintage mic to record funny voice clips for your friends.</li>
            </ul>
          </section>

          {/* Internal SEO Links */}
          <footer className="border-t border-foreground/20 pt-4 mt-6 text-xs sm:text-sm text-muted-foreground flex flex-wrap gap-3">
            <span>Explore more:</span>
            <Link to="/imposter-game-online" className="text-primary underline font-bold">Play Online</Link>
            <span>·</span>
            <Link to="/how-to-play" className="text-primary underline font-bold">Rules & Guide</Link>
            <span>·</span>
            <Link to="/imposter-word-list" className="text-primary underline font-bold">Word Pairs</Link>
            <span>·</span>
            <Link to="/imposter-game-questions" className="text-primary underline font-bold">Questions & Hints</Link>
          </footer>
        </article>
      </div>
    </main>
  );
}
