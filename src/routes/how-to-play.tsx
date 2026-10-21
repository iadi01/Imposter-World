import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Search, Eye, Mic, Palette } from "lucide-react";

export const Route = createFileRoute("/how-to-play")({
  head: () => ({
    meta: [
      { title: "How To Play Imposter World — Complete Classroom Rules & Guide" },
      { name: "description", content: "Learn how to play Imposter World step-by-step. Discover secret word reveal, drawing & text clue turns, debate interrogation, and voting rules with visual illustrations." },
      { property: "og:title", content: "How To Play Imposter World — Classroom Guide" },
      { property: "og:description", content: "Learn how to play Imposter World step-by-step with illustrated rules and strategies." },
    ],
  }),
  component: HowToPlayPage,
});

function HowToPlayPage() {
  return (
    <main className="min-h-screen px-3 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm font-hand text-muted-foreground">
          <Link to="/" className="text-primary hover:underline flex items-center gap-1 font-bold">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
          <span>/</span>
          <span className="text-foreground font-bold">How To Play Imposter World</span>
        </nav>

        {/* Notebook Paper Sheet */}
        <article className="notebook relative p-6 sm:p-10 shadow-lg space-y-6 font-hand text-foreground leading-relaxed">
          <div className="tape absolute -top-3 left-1/2 h-6 w-36 -translate-x-1/2 rotate-[-1deg]" />

          <header className="border-b-2 border-foreground/20 pb-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-block bg-highlight px-2.5 py-0.5 rounded text-xs font-bold border border-foreground/30">
                  Classroom Handbook
                </span>
                <h1 className="text-3xl sm:text-5xl font-display text-foreground font-bold">
                  How To Play Imposter World
                </h1>
                <p className="text-base sm:text-lg text-primary font-bold">
                  What Is Imposter World? The complete guide to bluffing, sleuthing, and deducing.
                </p>
                <p className="text-xs text-muted-foreground">
                  Official Classroom Rules & Illustrated Handbook
                </p>
              </div>
              <img
                src="/detective-waving.png"
                alt="Detective Waving"
                className="h-20 w-20 sm:h-24 sm:w-24 object-contain self-start sm:self-auto shrink-0 drop-shadow-md"
              />
            </div>
          </header>

          {/* Section 1: What is Imposter World */}
          <section className="space-y-3">
            <h2 className="text-2xl font-display font-bold text-foreground">What Is Imposter World?</h2>
            <p className="text-sm sm:text-base">
              <strong>Imposter World</strong> is a fast-paced multiplayer party game played with classmates, friends, or family. Everyone in the classroom receives the exact same secret word — <em>except for the sneaky Imposter</em>, who receives a closely related lookalike word.
            </p>

            {/* Example Lookalike Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-muted/40 rounded-lg border border-foreground/20 text-xs sm:text-sm">
              <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-md border border-primary/20">
                <span className="text-2xl sm:text-3xl">☕</span>
                <div>
                  <div className="font-bold text-primary">Classroom Detectives Word</div>
                  <div className="font-mono font-bold text-base text-foreground">"Coffee"</div>
                  <div className="text-[11px] text-muted-foreground">Players know this word and give subtle hints.</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-md border border-accent/20">
                <span className="text-2xl sm:text-3xl">🫖</span>
                <div>
                  <div className="font-bold text-accent">Sneaky Imposter Word</div>
                  <div className="font-mono font-bold text-base text-foreground">"Tea"</div>
                  <div className="text-[11px] text-muted-foreground">The Imposter bluffs thinking everyone has tea!</div>
                </div>
              </div>
            </div>

            <p className="text-sm sm:text-base">
              The goal of the Detectives is to discover who the Imposter is by listening to hints and analyzing clues. The goal of the Imposter is to blend in, bluff without getting caught, and survive the classroom interrogation!
            </p>
          </section>

          {/* Section 2: Step-by-Step Round Flow (Organic Illustrated Storybook — No Trapping Boxes) */}
          <section className="space-y-6 pt-2">
            <div className="flex items-center justify-between border-b-2 border-foreground/20 pb-2">
              <h2 className="text-2xl font-display font-bold text-foreground">
                Step-by-Step Round Flow
              </h2>
              <span className="text-xs font-hand font-bold text-muted-foreground bg-accent/15 text-accent px-2.5 py-1 rounded-full border border-accent/30">
                4 Simple Phases
              </span>
            </div>

            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 border-b border-dashed border-foreground/20 pb-6">
                <div className="shrink-0 flex items-center justify-center p-2">
                  <img
                    src="/detective-covering-eyes.png"
                    alt="Detective Covering Eyes"
                    className="h-32 w-auto sm:h-36 object-contain drop-shadow-md hover:scale-105 transition-transform select-none pointer-events-none"
                  />
                </div>
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <div className="font-bold text-primary font-display text-xl flex items-center justify-center sm:justify-start gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white text-xs font-mono font-bold shadow-xs">
                      1
                    </span>
                    Secret Word Reveal 👁️
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed text-foreground/90">
                    At the start of the round, your detective covers his eyes! Tap the <strong>"Open Eyes"</strong> button to secretly inspect your assigned word. Never let your desk mates peek at your screen!
                  </p>
                  <div className="inline-block bg-accent/10 border-l-4 border-accent text-accent px-3 py-1.5 rounded-r text-xs font-mono">
                    💡 Detectives receive the authentic secret word, while the Imposter receives a clever lookalike clue.
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 border-b border-dashed border-foreground/20 pb-6">
                <div className="shrink-0 flex items-center justify-center p-2">
                  <img
                    src="/detective-drawing.png"
                    alt="Detective Drawing Clue"
                    className="h-32 w-auto sm:h-36 object-contain drop-shadow-md hover:scale-105 transition-transform select-none pointer-events-none"
                  />
                </div>
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <div className="font-bold text-primary font-display text-xl flex items-center justify-center sm:justify-start gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white text-xs font-mono font-bold shadow-xs">
                      2
                    </span>
                    Sequential Clue Turns ✏️
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed text-foreground/90">
                    Classmates take turns one by one. You have up to 80 seconds to submit 1 clue. You can <strong>Write Text</strong>, draw with the <strong>Chalkboard Sketchpad 🎨</strong>, or record a <strong>Live Voice Hint 🎙️</strong>!
                  </p>
                  <div className="inline-block bg-primary/10 border-l-4 border-primary text-primary px-3 py-1.5 rounded-r text-xs font-mono">
                    💡 Be subtle! If your clue is too obvious, the Imposter will easily deduce the secret word and blend in.
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 border-b border-dashed border-foreground/20 pb-6">
                <div className="shrink-0 flex items-center justify-center p-2">
                  <img
                    src="/detective-magnifier.png"
                    alt="Detective Investigating"
                    className="h-32 w-auto sm:h-36 object-contain drop-shadow-md hover:scale-105 transition-transform select-none pointer-events-none"
                  />
                </div>
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <div className="font-bold text-primary font-display text-xl flex items-center justify-center sm:justify-start gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white text-xs font-mono font-bold shadow-xs">
                      3
                    </span>
                    Classroom Debate & Interrogation 🗣️
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed text-foreground/90">
                    All submitted hints, sketches, and audio recordings are pinned to the Blackboard. The classroom enters 120s live debate! Cross-question suspicious hints, call out bluffers, and catch whoever seems confused.
                  </p>
                  <div className="inline-block bg-accent/10 border-l-4 border-accent text-accent px-3 py-1.5 rounded-r text-xs font-mono">
                    💡 Pay close attention to players who give overly vague clues or copy someone else's idea.
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 pb-2">
                <div className="shrink-0 relative flex items-center justify-center p-2">
                  <img
                    src="/detective-jumping-win.png"
                    alt="Detective Victory Celebration"
                    className="h-32 w-auto sm:h-36 object-contain drop-shadow-md hover:scale-105 transition-transform select-none pointer-events-none"
                  />
                  <img
                    src="/stamp-confidential.png"
                    alt="Confidential Stamp"
                    className="absolute -bottom-2 -right-3 h-14 w-14 object-contain rotate-[-12deg] drop-shadow-xs pointer-events-none opacity-90"
                  />
                </div>
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <div className="font-bold text-primary font-display text-xl flex items-center justify-center sm:justify-start gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white text-xs font-mono font-bold shadow-xs">
                      4
                    </span>
                    Confidential Voting & Imposter Reveal 🗳️
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed text-foreground/90">
                    Every detective casts their confidential ballot for who they believe is the Imposter. Votes are tallied in real time. If the classroom catches the imposter, detectives win! If the imposter survives, they take the crown! 👑
                  </p>
                  <div className="inline-block bg-primary/10 border-l-4 border-primary text-primary px-3 py-1.5 rounded-r text-xs font-mono">
                    💡 Even if caught, the Imposter can attempt a high-stakes "Final Word Guess" to steal the victory!
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Detective vs Imposter Tips */}
          <section className="space-y-4 pt-2">
            <h2 className="text-2xl font-display font-bold text-foreground">Tactics & Strategy</h2>
            <div className="space-y-3">
              <div className="sketch bg-primary/10 p-4 space-y-1.5 border border-primary/30">
                <div className="font-bold text-primary font-display text-base">🔎 For Detectives:</div>
                <p className="text-xs sm:text-sm">
                  Do not make your clue too obvious! If you say "barking" for "Dog", the Imposter will immediately know the secret word and blend in easily. Make your clue subtle so fellow detectives understand it, but the imposter stays confused.
                </p>
              </div>

              <div className="sketch bg-accent/10 p-4 space-y-1.5 border border-accent/30">
                <div className="font-bold text-accent font-display text-base">🕵️ For Imposters:</div>
                <p className="text-xs sm:text-sm">
                  Listen closely to the first player's clue! Give an ambiguous clue that fits both your word and the general category (e.g. "it's warm" or "found in nature"). If someone accuses you, stay confident and turn the suspicion onto another classmate!
                </p>
              </div>
            </div>
          </section>

          {/* Bottom Related Navigation */}
          <footer className="border-t-2 border-foreground/20 pt-6 flex flex-wrap gap-3 text-xs sm:text-sm font-bold text-primary">
            <Link to="/" className="hover:underline">Play Imposter World</Link>
            <span>•</span>
            <Link to="/notice-board" className="hover:underline">Notice Board</Link>
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
