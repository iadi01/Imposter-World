import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Trash2, ShieldAlert, CheckCircle, Mail } from "lucide-react";

export const Route = createFileRoute("/delete-account")({
  component: DeleteAccountPage,
});

function DeleteAccountPage() {
  return (
    <main className="min-h-screen px-3 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm font-hand text-muted-foreground">
          <Link to="/" className="text-primary hover:underline flex items-center gap-1 font-bold">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
          <span>/</span>
          <span className="text-foreground font-bold">Delete your account</span>
        </nav>

        {/* Notebook Paper Sheet */}
        <article className="notebook relative p-6 sm:p-10 shadow-lg space-y-6 font-hand text-foreground leading-relaxed">
          <div className="tape absolute -top-3 left-1/2 h-6 w-36 -translate-x-1/2 rotate-[-1deg]" />

          <header className="border-b-2 border-foreground/20 pb-4 space-y-2">
            <span className="inline-block bg-destructive/15 text-destructive px-2.5 py-0.5 rounded text-xs font-bold border border-destructive/30">
              Notice
            </span>
            <h1 className="text-4xl sm:text-5xl font-display text-foreground font-bold">
              Delete your account
            </h1>
            <p className="text-lg text-primary font-bold">
              How to ask us to erase your Imposter World account and what is kept afterwards.
            </p>
            <p className="text-xs text-muted-foreground">
              Effective 28 August 2026 · Last updated 21 October 2026
            </p>
          </header>

          <section className="space-y-3">
            <h2 className="text-2xl font-display font-bold text-foreground">How to delete your account</h2>
            <ol className="list-decimal pl-5 space-y-2 text-sm">
              <li>
                Open Imposter World on your device while signed in.
              </li>
              <li>
                Click your <strong>Profile avatar</strong> in the top classroom toolbar to open your Detective Record.
              </li>
              <li>
                Scroll down and click <strong>"Log Out & Clear Local Data"</strong>. To permanently purge your cloud database record, click <strong>"Request Full Account Erasure"</strong>.
              </li>
              <li>
                If you cannot access the game in your browser, email <a href="mailto:hello@imposterworld.xyz?subject=Delete%20my%20Imposter%20World%20account" className="text-accent underline font-bold">hello@imposterworld.xyz</a> from the email address bound to your account with subject <em>"Delete my Imposter World account"</em>.
              </li>
            </ol>
          </section>

          <section className="space-y-3 pt-2">
            <h2 className="text-2xl font-display font-bold text-foreground">What gets deleted</h2>
            <p className="text-sm">Once your erasure request is processed, the following items are permanently and irreversibly removed:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li>The binding between your Google account and your player record.</li>
              <li>Your personal statistics: total matches played, detective wins, imposter wins, and win rate.</li>
              <li>Your Display Name on live class rankings and competitive leaderboards.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-2">
            <h2 className="text-2xl font-display font-bold text-foreground">What is kept, and for how long</h2>
            <p className="text-sm">Some non-identifiable data is retained in accordance with the DPDP Act 2023:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li><strong>Anonymized Match Records:</strong> Completed matches keep an anonymized placeholder name so that round win/loss calculations for other players remain mathematically intact.</li>
              <li><strong>Security & Network Logs:</strong> Basic IP and abuse prevention logs are retained for up to 1 year, then deleted.</li>
            </ul>
          </section>

          {/* Bottom Related Navigation */}
          <footer className="border-t-2 border-foreground/20 pt-6 flex flex-wrap gap-3 text-xs sm:text-sm font-bold text-primary">
            <Link to="/" className="hover:underline">Play Imposter World</Link>
            <span>•</span>
            <Link to="/how-to-play" className="hover:underline">How To Play</Link>
            <span>•</span>
            <Link to="/notice-board" className="hover:underline">Notice Board</Link>
            <span>•</span>
            <Link to="/terms" className="hover:underline">Terms of Use</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
            <span>•</span>
            <Link to="/support" className="hover:underline">Support the Dev</Link>
          </footer>
        </article>
      </div>
    </main>
  );
}
