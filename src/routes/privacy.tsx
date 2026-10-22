import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, Lock, Mail } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main className="min-h-screen px-3 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm font-hand text-muted-foreground">
          <Link to="/" className="text-primary hover:underline flex items-center gap-1 font-bold">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
          <span>/</span>
          <span className="text-foreground font-bold">Privacy Policy</span>
        </nav>

        {/* Notebook Paper Sheet */}
        <article className="notebook relative p-4 sm:p-8 md:p-10 shadow-lg space-y-6 font-hand text-foreground leading-relaxed">
          <div className="tape absolute -top-3 left-1/2 h-6 w-36 -translate-x-1/2 rotate-[-1deg]" />

          <header className="border-b-2 border-foreground/20 pb-4 space-y-2">
            <span className="inline-block bg-highlight px-2.5 py-0.5 rounded text-xs font-bold border border-foreground/30">
              Notice
            </span>
            <h1 className="text-4xl sm:text-5xl font-display text-foreground font-bold">
              Privacy Policy
            </h1>
            <p className="text-lg text-primary font-bold">
              How Imposter World collects, uses, and protects your personal data.
            </p>
            <p className="text-xs text-muted-foreground">
              Effective 24 August 2026 · Last updated 21 October 2026
            </p>
            <p className="text-sm pt-2">
              This document serves as our privacy notice under Section 5 of the Digital Personal Data Protection Act, 2023 (“DPDP Act”), the DPDP Rules, 2025, and the Information Technology (SPDI) Rules, 2011.
            </p>
          </header>

          {/* Section 1 & 2 */}
          <section className="space-y-2">
            <h2 className="text-2xl font-display font-bold text-foreground">1. Who We Are & Data Fiduciary</h2>
            <p className="text-sm">
              1.1 For the purposes of the DPDP Act, 2023, the publisher of Imposter World operates as the <strong>Data Fiduciary</strong>. You are the <strong>Data Principal</strong> regarding personal data processed by us.
            </p>
            <p className="text-sm">
              1.2 We collect only the minimum data required to facilitate real-time multiplayer party games, enforce fair play, maintain leaderboards, and prevent abuse.
            </p>
          </section>

          {/* Itemized Table of Personal Data */}
          <section className="space-y-3 pt-2">
            <h2 className="text-2xl font-display font-bold text-foreground">3. Itemized Data We Process</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse border border-foreground/30">
                <thead>
                  <tr className="bg-secondary/60 font-bold border-b border-foreground/30">
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5">Data Collected</th>
                    <th className="p-2.5">Specified Purpose</th>
                    <th className="p-2.5">Required?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-foreground/20">
                  <tr>
                    <td className="p-2.5 font-bold">Player Identifier</td>
                    <td className="p-2.5">Random session ID, local scores, match status</td>
                    <td className="p-2.5">Maintains active game state in browser</td>
                    <td className="p-2.5">Yes (to play)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Display Name & Rank</td>
                    <td className="p-2.5">Nickname chosen by player, wins, matches played</td>
                    <td className="p-2.5">Renders classroom leaderboards & in-game identity</td>
                    <td className="p-2.5">Yes</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Google Sign-In (Optional)</td>
                    <td className="p-2.5">Email address, Google account ID, profile name</td>
                    <td className="p-2.5">Restores player record and rankings across multiple devices</td>
                    <td className="p-2.5">No (optional)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Live Room Session</td>
                    <td className="p-2.5">Clues submitted (text/sketch/voice), chat messages</td>
                    <td className="p-2.5">Synchronizes real-time clue turns among classmates</td>
                    <td className="p-2.5">Yes (in room)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Network & Security</td>
                    <td className="p-2.5">IP address, user-agent, room code</td>
                    <td className="p-2.5">Prevents automated spam, duplicate joins, DDoS</td>
                    <td className="p-2.5">Yes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4 to 8 */}
          <section className="space-y-2 pt-2">
            <h2 className="text-2xl font-display font-bold text-foreground">4. Legal Basis under Indian Law</h2>
            <p className="text-sm">
              We process personal data based on your <strong>consent</strong> when you choose to play, enter a display name, or sign in with Google. You may withdraw consent at any time as described in Section 15.
            </p>
          </section>

          <section className="space-y-2 pt-2">
            <h2 className="text-2xl font-display font-bold text-foreground">7. Cookies & Local Storage</h2>
            <p className="text-sm">
              We use strictly necessary browser local storage to preserve your game progress, audio preferences (such as lo-fi volume and mute flags), and session tokens. We do not use third-party tracking cookies.
            </p>
          </section>

          <section className="space-y-2 pt-2">
            <h2 className="text-2xl font-display font-bold text-foreground">14. Your Rights Under DPDP Act, 2023</h2>
            <p className="text-sm">
              As a Data Principal, you have the right to:
            </p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li><strong>Access:</strong> Request a summary of personal data held about you.</li>
              <li><strong>Correction:</strong> Update inaccurate display names or state/country info.</li>
              <li><strong>Erasure:</strong> Request permanent deletion of your account and stats via our <Link to="/delete-account" className="text-primary underline font-bold">Delete Account page</Link>.</li>
              <li><strong>Grievance Redressal:</strong> Submit grievances directly to our designated Grievance Officer.</li>
            </ul>
          </section>

          {/* Grievance Redressal */}
          <section className="space-y-2 pt-2 border-t border-foreground/20 pt-4">
            <h2 className="text-2xl font-display font-bold text-foreground">16. Grievance Redressal & Contacts</h2>
            <div className="sketch bg-white/80 p-4 text-xs sm:text-sm space-y-1">
              <div className="font-bold">Grievance Officer — Imposter World</div>
              <div>Email: <a href="mailto:hello@imposterworld.xyz" className="text-primary underline">hello@imposterworld.xyz</a></div>
              <div>Timelines: Grievance acknowledged within 24 hours, resolved within 15 days.</div>
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              If you are unsatisfied with our resolution, you have the right to lodge a complaint with the Data Protection Board of India (DPBI) at <a href="https://www.meity.gov.in" target="_blank" rel="noreferrer" className="underline">meity.gov.in</a>.
            </p>
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
            <Link to="/support" className="hover:underline">Support the Dev</Link>
            <span>•</span>
            <Link to="/delete-account" className="hover:underline">Delete Account</Link>
          </footer>
        </article>
      </div>
    </main>
  );
}
