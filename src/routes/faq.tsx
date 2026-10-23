import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Play, HelpCircle, ChevronDown, CheckCircle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Frequently Asked Questions (FAQ) — Imposter World" },
      {
        name: "description",
        content:
          "Everything you need to know about playing Imposter World. Answers about player limits, anti-cheat features, rules, voice clues, and device compatibility.",
      },
      { name: "keywords", content: "imposter game FAQ, how to play imposter game, imposter game rules, is imposter world free, how many players can play imposter" },
      { property: "og:title", content: "Frequently Asked Questions (FAQ) — Imposter World" },
      { property: "og:description", content: "Find quick answers to common questions about Imposter World." },
      { property: "og:image", content: "https://imposter-world.onrender.com/classroom-bg.jpg" },
    ],
    links: [
      { rel: "canonical", href: "https://imposter-world.onrender.com/faq" },
    ],
    scripts: [
      {
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
      }
    ]
  }),
  component: FAQPage,
});

const FAQS = [
  {
    q: "What is Imposter World and how does it work?",
    a: "Imposter World is an online multiplayer party word game set in a nostalgic school classroom. At the start of each round, everyone receives the same secret word (e.g. 'Coffee'), but the Imposter receives a slightly different related word (e.g. 'Tea'). Players take turns giving subtle clues via drawing, text, or voice clips, followed by a discussion and vote to uncover the imposter.",
  },
  {
    q: "How many players can play together?",
    a: "Online private rooms support 3 to 14 players. If you are sitting together with friends or family, you can use the 'Local Pass & Play' mode to share 1 single device between 2 to 10 players.",
  },
  {
    q: "Is Imposter World free? Are there any in-app purchases?",
    a: "Imposter World is 100% free to play. All 7,800+ word pairs, real-time multiplayer modes, drawing tools, and audio voice clues are completely unlocked for everyone without any paywall.",
  },
  {
    q: "Do I or my friends need to install an app or create an account?",
    a: "No download is required. It works directly in Chrome, Safari, Firefox, and Edge on any smartphone or computer. You can play instantly as a Guest with a single click, or sign in with Google to save your classroom win statistics and leaderboard ranking.",
  },
  {
    q: "How do voice clues and drawing pads work?",
    a: "During clue-giving turns, players can type a text clue, use their finger/mouse to sketch a doodle on the vintage notebook drawing pad, or hold the vintage microphone button to record a quick voice snippet. The room host can customize which clue types are enabled in Room Settings.",
  },
  {
    q: "How is cheating prevented?",
    a: "Unlike peer-to-peer web games where the secret word is sent to all devices, Imposter World keeps words and roles locked on a secure Node.js server. The client browser only ever receives its own assigned secret word, making client-side inspection or cheat scripts impossible.",
  },
  {
    q: "What happens if the room host leaves mid-game?",
    a: "The room server automatically migrates host ownership to the next active player in the room seamlessly, ensuring your game continues without interruption.",
  },
  {
    q: "Can players skip discussion if everyone is ready to vote?",
    a: "Yes! During the debate phase, players can click the 'Skip Discussion' button. Once a majority of players vote to skip, the round immediately transitions into the voting ballot box phase.",
  },
];

function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <main className="min-h-screen px-3 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm font-hand text-muted-foreground">
          <Link to="/" className="text-primary hover:underline flex items-center gap-1 font-bold">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
          <span>/</span>
          <span className="text-foreground font-bold">Frequently Asked Questions</span>
        </nav>

        {/* Notebook Content Sheet */}
        <article className="notebook relative p-4 sm:p-8 md:p-10 shadow-lg space-y-6 font-hand text-foreground leading-relaxed">
          <div className="tape absolute -top-3 left-1/2 h-6 w-36 -translate-x-1/2 rotate-[-1deg]" />

          <header className="border-b-2 border-foreground/20 pb-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-block bg-highlight px-2.5 py-0.5 rounded text-xs font-bold border border-foreground/30">
                  Help Desk & FAQ
                </span>
                <h1 className="text-3xl sm:text-5xl font-display text-foreground font-bold">
                  Frequently Asked Questions
                </h1>
                <p className="text-base sm:text-lg text-primary font-bold">
                  Everything you need to know about playing, hosting, and winning Imposter World.
                </p>
              </div>
              <img
                src="/detective.png"
                alt="Detective Mascot"
                className="h-20 w-20 sm:h-24 sm:w-24 object-contain self-start sm:self-auto shrink-0 drop-shadow-md"
              />
            </div>
          </header>

          {/* Quick Play CTA */}
          <div className="p-4 bg-primary/10 rounded-xl border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-sm">
              <strong>Have all your questions answered?</strong> Jump into class and start catching bluffers!
            </div>
            <Link
              to="/"
              className="sketch flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 font-bold hover:brightness-110 shrink-0 text-sm shadow-sm"
            >
              <Play className="h-4 w-4 fill-current" /> Create Room
            </Link>
          </div>

          {/* FAQ Accordion List */}
          <section className="space-y-3 pt-2">
            {FAQS.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={idx}
                  className="rounded-lg border-2 border-foreground/20 bg-white/85 overflow-hidden transition-all shadow-xs"
                >
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full text-left p-4 font-display text-lg font-bold text-foreground flex items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-primary shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-sm text-foreground/90 border-t border-foreground/10 leading-relaxed font-hand">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </section>

          {/* Internal SEO Links */}
          <footer className="border-t border-foreground/20 pt-4 mt-6 text-xs sm:text-sm text-muted-foreground flex flex-wrap gap-3">
            <span>Explore more:</span>
            <Link to="/how-to-play" className="text-primary underline font-bold">How To Play</Link>
            <span>·</span>
            <Link to="/imposter-game-online" className="text-primary underline font-bold">Play Online</Link>
            <span>·</span>
            <Link to="/imposter-word-list" className="text-primary underline font-bold">Word List</Link>
            <span>·</span>
            <Link to="/imposter-game-questions" className="text-primary underline font-bold">Questions & Clues</Link>
            <span>·</span>
            <Link to="/privacy" className="text-primary underline font-bold">Privacy Policy</Link>
          </footer>
        </article>
      </div>
    </main>
  );
}
