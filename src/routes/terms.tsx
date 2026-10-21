import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, ShieldCheck, Mail } from "lucide-react";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

function TermsPage() {
  return (
    <main className="min-h-screen px-3 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm font-hand text-muted-foreground">
          <Link to="/" className="text-primary hover:underline flex items-center gap-1 font-bold">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
          <span>/</span>
          <span className="text-foreground font-bold">Terms of Use</span>
        </nav>

        {/* Notebook Paper Sheet */}
        <article className="notebook relative p-6 sm:p-10 shadow-lg space-y-6 font-hand text-foreground leading-relaxed">
          <div className="tape absolute -top-3 left-1/2 h-6 w-36 -translate-x-1/2 rotate-[-1deg]" />

          <header className="border-b-2 border-foreground/20 pb-4 space-y-2">
            <span className="inline-block bg-highlight px-2.5 py-0.5 rounded text-xs font-bold border border-foreground/30">
              Notice
            </span>
            <h1 className="text-4xl sm:text-5xl font-display text-foreground font-bold">
              Terms of Use
            </h1>
            <p className="text-lg text-primary font-bold">
              The contract for using Imposter World.
            </p>
            <p className="text-xs text-muted-foreground">
              Effective 24 August 2026 · Last updated 21 October 2026
            </p>
            <p className="text-sm pt-2">
              These Terms of Use (“Terms”) form a legally binding agreement between you and the publisher of the website and real-time multiplayer application known as Imposter World (“Service”).
            </p>
          </header>

          {/* Table of Contents */}
          <div className="sketch bg-white/70 p-4 space-y-2 text-xs sm:text-sm">
            <div className="font-bold font-display text-base text-primary">Sections Overview:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-primary">
              <a href="#s1" className="hover:underline">1. Parties and the Service</a>
              <a href="#s2" className="hover:underline">2. Definitions</a>
              <a href="#s3" className="hover:underline">3. Acceptance and changes</a>
              <a href="#s4" className="hover:underline">4. Eligibility</a>
              <a href="#s5" className="hover:underline">5. Licence to use the Service</a>
              <a href="#s6" className="hover:underline">6. Accounts and authentication</a>
              <a href="#s7" className="hover:underline">7. Virtual items and progression</a>
              <a href="#s8" className="hover:underline">8. User Content</a>
              <a href="#s9" className="hover:underline">9. Multiplayer rooms</a>
              <a href="#s10" className="hover:underline">10. Acceptable use (IT Rules 2021)</a>
              <a href="#s11" className="hover:underline">11. Fair play & Anti-cheat</a>
              <a href="#s12" className="hover:underline">12. Advertising</a>
              <a href="#s13" className="hover:underline">13. Third-party services</a>
              <a href="#s14" className="hover:underline">14. Intellectual property</a>
              <a href="#s15" className="hover:underline">15. Feedback</a>
              <a href="#s16" className="hover:underline">16. Availability and modifications</a>
              <a href="#s17" className="hover:underline">17. Suspension and termination</a>
              <a href="#s18" className="hover:underline">18. Disclaimers</a>
              <a href="#s19" className="hover:underline">19. Limitation of liability</a>
              <a href="#s20" className="hover:underline">20. Indemnity</a>
              <a href="#s21" className="hover:underline">21. Privacy & DPDP Act</a>
              <a href="#s22" className="hover:underline">22. Governing law and disputes</a>
              <a href="#s23" className="hover:underline">23. General & Sound credits</a>
              <a href="#s24" className="hover:underline">24. Contact and grievances</a>
            </div>
          </div>

          {/* Section 1 */}
          <section id="s1" className="space-y-2 pt-2">
            <h2 className="text-2xl font-display font-bold text-foreground">1. Parties and the Service</h2>
            <p className="text-sm">
              1.1 These Terms govern access to and use of the real-time social deduction party game known as Imposter World, including related pages, game rooms, API endpoints, and invite links issued by us.
            </p>
            <p className="text-sm">
              1.2 In these Terms, “we”, “us” and “our” mean the publisher and operator of Imposter World. “You” and “your” mean the individual who accesses or uses the Service.
            </p>
            <p className="text-sm">
              1.3 Imposter World is an online multiplayer social deduction game where players receive secret words and try to unmask the imposter through text, drawings, and voice hints. The service is offered for personal recreational entertainment.
            </p>
            <p className="text-sm">
              1.4 The Service is currently offered free of charge. If optional premium cosmetic features are introduced in the future, clear notice will be provided before any charges apply.
            </p>
          </section>

          {/* Section 2 */}
          <section id="s2" className="space-y-2 pt-2">
            <h2 className="text-2xl font-display font-bold text-foreground">2. Definitions</h2>
            <p className="text-sm">
              <strong>“Display Name”</strong> means the name you enter for use on public leaderboards, game rooms, and match records.<br />
              <strong>“Match Record”</strong> means a completed multiplayer match written to our database for scoring, leaderboards, and statistics.<br />
              <strong>“Player Record”</strong> means the unique account or guest identifier associated with your device or Google sign-in.<br />
              <strong>“Privacy Policy”</strong> means the notice at <Link to="/privacy" className="text-primary underline">/privacy</Link>, which describes personal data handling under the Digital Personal Data Protection Act, 2023.<br />
              <strong>“User Content”</strong> means hints (text, sketches, or voice recordings), chat messages, or display names submitted during a game session.<br />
              <strong>“Virtual Items”</strong> means in-game points, badges, leaderboard ranks, and trophies that exist solely inside the Service.
            </p>
          </section>

          {/* Section 3 */}
          <section id="s3" className="space-y-2 pt-2">
            <h2 className="text-2xl font-display font-bold text-foreground">3. Acceptance and changes</h2>
            <p className="text-sm">
              3.1 By accessing the Service, joining a room, playing as guest, or signing in, you agree to these Terms and the Privacy Policy. If you do not agree, you must not use the Service.
            </p>
            <p className="text-sm">
              3.2 Continued use after the effective date constitutes acceptance of amended Terms. Changes do not retroactively alter legitimate completed Match Records.
            </p>
            <p className="text-sm">
              3.3 Pursuant to Rule 3(1) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 (“IT Rules, 2021”), users are informed annually that non-compliance with these Terms may result in immediate account suspension or termination.
            </p>
          </section>

          {/* Section 4 */}
          <section id="s4" className="space-y-2 pt-2">
            <h2 className="text-2xl font-display font-bold text-foreground">4. Eligibility</h2>
            <p className="text-sm">
              4.1 The Service is directed at persons 18 years of age or older, or minors playing under parental or classroom supervisor guidance.
            </p>
            <p className="text-sm">
              4.2 You are responsible for ensuring that your access and use of the Service is lawful under the jurisdiction from which you access it.
            </p>
          </section>

          {/* Section 5 & 6 */}
          <section id="s5" className="space-y-2 pt-2">
            <h2 className="text-2xl font-display font-bold text-foreground">5. Licence to use the Service</h2>
            <p className="text-sm">
              We grant you a personal, revocable, non-exclusive, non-transferable licence to play Imposter World for your private, non-commercial enjoyment. You agree not to reverse engineer, scrape, frame, or automate interactions with the game servers.
            </p>
          </section>

          <section id="s6" className="space-y-2 pt-2">
            <h2 className="text-2xl font-display font-bold text-foreground">6. Accounts and authentication</h2>
            <p className="text-sm">
              6.1 You may play as a Guest without registration, or sign in via Google OAuth to preserve your stats, win records, and leaderboard rankings across devices.
            </p>
            <p className="text-sm">
              6.2 We do not store Google passwords. Authentication is handled securely through Google's OAuth2 endpoints.
            </p>
          </section>

          {/* Section 7 to 11 */}
          <section id="s7" className="space-y-2 pt-2">
            <h2 className="text-2xl font-display font-bold text-foreground">7. Virtual items and game progression</h2>
            <p className="text-sm">
              Imposter World is a game of skill and deduction. There is no real-money wagering, gambling, or cash prizes. In-game points and rankings have zero monetary value.
            </p>
          </section>

          <section id="s8" className="space-y-2 pt-2">
            <h2 className="text-2xl font-display font-bold text-foreground">8. User Content & Clues</h2>
            <p className="text-sm">
              You retain ownership of clues and drawings you submit. You grant us a temporary licence to transmit these items in real-time to other players in your game room. Clues and chat messages must comply with community standards.
            </p>
          </section>

          <section id="s9" className="space-y-2 pt-2">
            <h2 className="text-2xl font-display font-bold text-foreground">9. Multiplayer rooms & Reconnection</h2>
            <p className="text-sm">
              9.1 Game rooms enforce strict server-side timers and confidential word isolation. A player who disconnects has a grace period to reconnect before their seat is forfeited.
            </p>
            <p className="text-sm">
              9.2 A single user cannot join the same room twice simultaneously from multiple tabs or duplicate connections.
            </p>
          </section>

          <section id="s10" className="space-y-2 pt-2">
            <h2 className="text-2xl font-display font-bold text-foreground">10. Acceptable use (Rule 3(1)(b) IT Rules, 2021)</h2>
            <p className="text-sm">
              Users shall not upload, display, transmit, or share any information that is defamatory, obscene, invasive of another's privacy, harmful to minors, infringes intellectual property, contains software viruses, impersonates another person, or threatens the sovereignty, integrity, or public order of India.
            </p>
          </section>

          <section id="s11" className="space-y-2 pt-2">
            <h2 className="text-2xl font-display font-bold text-foreground">11. Fair play & Anti-cheat</h2>
            <p className="text-sm">
              Cheating, automated scripts, packet injection, deliberate match collusion, or stream sniping violates fair play. Accounts violating these rules will be removed from rankings.
            </p>
          </section>

          {/* Section 21 to 24 */}
          <section id="s21" className="space-y-2 pt-2">
            <h2 className="text-2xl font-display font-bold text-foreground">21. Privacy & DPDP Act, 2023</h2>
            <p className="text-sm">
              Our data processing practices, consent mechanisms, and user rights under the Digital Personal Data Protection Act, 2023 are detailed in our <Link to="/privacy" className="text-primary underline font-bold">Privacy Policy</Link>.
            </p>
          </section>

          <section id="s23" className="space-y-2 pt-2">
            <h2 className="text-2xl font-display font-bold text-foreground">23. General & Sound Credits</h2>
            <p className="text-sm">
              Sound effects and lo-fi melodies are synthesized client-side via Web Audio API or licensed under Creative Commons CC0 / CC BY.
            </p>
          </section>

          <section id="s24" className="space-y-2 pt-2 border-t border-foreground/20 pt-4">
            <h2 className="text-2xl font-display font-bold text-foreground">24. Contact and Grievances</h2>
            <p className="text-sm">
              For legal questions, dispute resolution, or grievances under the IT Rules 2021 and DPDP Act 2023, you may contact our Grievance Officer:
            </p>
            <div className="sketch bg-white/80 p-4 text-xs sm:text-sm space-y-1">
              <div className="font-bold">Grievance Officer — Imposter World</div>
              <div>Email: <a href="mailto:hello@imposterworld.xyz" className="text-primary underline">hello@imposterworld.xyz</a></div>
              <div>Response timeline: Acknowledgment within 24 hours, resolution within 15 days.</div>
            </div>
          </section>

          {/* Bottom Related Navigation */}
          <footer className="border-t-2 border-foreground/20 pt-6 flex flex-wrap gap-3 text-xs sm:text-sm font-bold text-primary">
            <Link to="/" className="hover:underline">Play Imposter World</Link>
            <span>•</span>
            <Link to="/how-to-play" className="hover:underline">How To Play</Link>
            <span>•</span>
            <Link to="/notice-board" className="hover:underline">Notice Board</Link>
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
