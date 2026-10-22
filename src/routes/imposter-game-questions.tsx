import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Play, HelpCircle, MessageSquare, Lightbulb, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/imposter-game-questions")({
  head: () => ({
    meta: [
      { title: "Best Imposter Game Questions & Clue Giving Ideas | Imposter World" },
      {
        name: "description",
        content:
          "Discover the best questions, clue ideas, and interrogation tips for playing the Imposter word game. Learn how to trap the imposter and bluff convincingly.",
      },
      { name: "keywords", content: "imposter game questions, imposter game hints, imposter questions, how to interrogate in imposter game, imposter clue ideas" },
      { property: "og:title", content: "Best Imposter Game Questions & Clue Giving Ideas — Imposter World" },
      { property: "og:description", content: "Master the interrogation round with clever questions that catch the bluffer." },
      { property: "og:image", content: "https://imposterworld.xyz/classroom-bg.jpg" },
    ],
    links: [
      { rel: "canonical", href: "https://imposterworld.xyz/imposter-game-questions" },
    ],
  }),
  component: ImposterGameQuestionsPage,
});

const QUESTION_CATEGORIES = [
  {
    title: "Environment & Location Questions",
    desc: "Trap bluffers by asking where the object belongs without naming specific rooms.",
    questions: [
      "Is this something you would expect to find inside a school bag?",
      "Would you encounter this more frequently in the morning or at midnight?",
      "Is this typically kept in the kitchen, living room, or outdoors?",
      "Can this be purchased in a standard neighborhood grocery store?",
      "Is this something found in high altitudes or near water bodies?",
    ],
  },
  {
    title: "Sensory & Physical Attribute Questions",
    desc: "Test subtle qualities like texture, temperature, weight, and sound.",
    questions: [
      "If you dropped this on a tiled classroom floor, would it break or bounce?",
      "Does this usually feel hot, cold, or room temperature?",
      "Is this smaller than a pencil box, or bigger than a student desk?",
      "Does this produce an audible sound when being used?",
      "Is this flexible like paper, or rigid like cast iron?",
    ],
  },
  {
    title: "Usage & Action Questions",
    desc: "Check whether the suspect actually understands how people interact with the word.",
    questions: [
      "Do people consume this, wear this, or operate this with their hands?",
      "Would you feel comfortable gifting this to your teacher on Teachers' Day?",
      "Is this powered by electricity, battery, or human effort?",
      "How frequently does an average person use or interact with this in a single week?",
      "Would you take this with you when going on a family picnic?",
    ],
  },
];

function ImposterGameQuestionsPage() {
  return (
    <main className="min-h-screen px-3 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm font-hand text-muted-foreground">
          <Link to="/" className="text-primary hover:underline flex items-center gap-1 font-bold">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
          <span>/</span>
          <span className="text-foreground font-bold">Imposter Game Questions</span>
        </nav>

        {/* Notebook Content Sheet */}
        <article className="notebook relative p-6 sm:p-10 shadow-lg space-y-6 font-hand text-foreground leading-relaxed">
          <div className="tape absolute -top-3 left-1/2 h-6 w-36 -translate-x-1/2 rotate-[-1deg]" />

          <header className="border-b-2 border-foreground/20 pb-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-block bg-accent text-accent-foreground px-2.5 py-0.5 rounded text-xs font-bold">
                  Classroom Interrogation Manual
                </span>
                <h1 className="text-3xl sm:text-5xl font-display text-foreground font-bold">
                  Imposter Game Questions & Clues
                </h1>
                <p className="text-base sm:text-lg text-primary font-bold">
                  How to ask strategic questions during the discussion phase to catch the bluffer.
                </p>
              </div>
              <img
                src="/stamp-confidential.png"
                alt="Confidential Stamp"
                className="h-20 w-20 sm:h-24 sm:w-24 object-contain self-start sm:self-auto shrink-0 drop-shadow-md"
              />
            </div>
          </header>

          {/* Quick Action Box */}
          <div className="p-4 bg-primary/10 rounded-xl border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-sm">
              <strong>Put these interrogation questions to the test!</strong> Create a room and play with your group now.
            </div>
            <Link
              to="/"
              className="sketch flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 font-bold hover:brightness-110 shrink-0 text-sm shadow-sm"
            >
              <Play className="h-4 w-4 fill-current" /> Play Online
            </Link>
          </div>

          {/* Questions Sections */}
          <section className="space-y-6 pt-2">
            {QUESTION_CATEGORIES.map((cat, i) => (
              <div key={i} className="space-y-3">
                <div className="border-b border-foreground/20 pb-1">
                  <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-accent" /> {cat.title}
                  </h2>
                  <p className="text-xs text-muted-foreground">{cat.desc}</p>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {cat.questions.map((q, qIdx) => (
                    <div key={qIdx} className="p-3 bg-white/80 rounded-md border border-foreground/20 flex items-start gap-2.5 text-sm">
                      <span className="font-bold text-primary shrink-0">Q{qIdx + 1}.</span>
                      <span className="font-medium text-foreground">{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* Golden Rules of Clue Giving */}
          <section className="space-y-3 pt-3 p-4 bg-muted/40 rounded-xl border border-foreground/20">
            <h3 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" /> The Golden Rules of Giving Clues
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-foreground/90">
              <li>
                <strong>1. Never use rhyming words or direct anagrams:</strong> Saying "Sounds like bat" when the word is "Cat" immediately gives it away to the Imposter.
              </li>
              <li>
                <strong>2. Give multi-layered clues:</strong> Use feelings, colors, context, or personal memories (e.g. "We ate this during the 2023 train trip").
              </li>
              <li>
                <strong>3. If you suspect someone is the Imposter:</strong> Ask them to explain why their previous clue fits the category. Bluffers will often hesitate or give contradictory answers.
              </li>
            </ul>
          </section>

          {/* Internal SEO Links */}
          <footer className="border-t border-foreground/20 pt-4 mt-6 text-xs sm:text-sm text-muted-foreground flex flex-wrap gap-3">
            <span>Explore more:</span>
            <Link to="/how-to-play" className="text-primary underline font-bold">How To Play</Link>
            <span>·</span>
            <Link to="/imposter-word-list" className="text-primary underline font-bold">Word List</Link>
            <span>·</span>
            <Link to="/imposter-game-online" className="text-primary underline font-bold">Play Online</Link>
            <span>·</span>
            <Link to="/faq" className="text-primary underline font-bold">FAQ</Link>
          </footer>
        </article>
      </div>
    </main>
  );
}
