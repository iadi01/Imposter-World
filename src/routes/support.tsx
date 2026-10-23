import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import QRCode from "qrcode";
import { API_BASE } from "../lib/api";
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  QrCode,
  Smartphone,
  AlertTriangle,
  ShieldCheck,
  Heart,
  Coffee,
  Check,
  ChevronDown,
  CheckCircle2,
  X,
  Send,
  HelpCircle,
} from "lucide-react";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support the Developer — Imposter World ☕" },
      {
        name: "description",
        content:
          "Voluntary developer funding for Imposter World — servers, hosting, and classroom party multiplayer kept 100% free.",
      },
      { property: "og:title", content: "Support the Developer — Imposter World ☕" },
      {
        property: "og:description",
        content:
          "Voluntary developer funding for Imposter World — servers, hosting, and classroom party multiplayer kept 100% free.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://imposter-world.onrender.com/support" }],
  }),
  component: SupportPage,
});

type Supporter = {
  id: string;
  name: string;
  amount: number;
  message: string | null;
  paid_at: string;
  show_amount?: boolean;
};

const UPI_ID = "iadi0@ptyes";
const PAYEE_NAME = "Aditya Sharma";
const DEV_NAME = "Aditya Sharma · Website Developer";

const TIERS: { amount: number; label: string; icon: string }[] = [
  { amount: 11, label: "Shagun", icon: "🪙" },
  { amount: 21, label: "Ice Cream", icon: "🍦" },
  { amount: 51, label: "Chai & Samosa", icon: "🫖" },
  { amount: 101, label: "Double Espresso", icon: "☕" },
  { amount: 251, label: "Server Fuel", icon: "⚡" },
  { amount: 501, label: "Code Supercharger", icon: "🚀" },
  { amount: 1001, label: "Guardian Patron", icon: "🛡️" },
  { amount: 2501, label: "Founding Legend", icon: "💎" },
  { amount: 9999, label: "Classroom Legend", icon: "👑" },
];

function buildUpiUri(amount: number) {
  const params = new URLSearchParams({
    pa: UPI_ID,
    pn: PAYEE_NAME,
    am: String(amount),
    cu: "INR",
  });
  return `upi://pay?${params.toString()}`;
}

function UpiQr({ amount }: { amount: number }) {
  const [dataUrl, setDataUrl] = useState<string>("");
  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(buildUpiUri(amount), {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 512,
      color: { dark: "#1a120b", light: "#fef9ee" },
    })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [amount]);

  if (!dataUrl) {
    return <div className="w-full aspect-square bg-muted/30 animate-pulse rounded" />;
  }
  return (
    <img
      src={dataUrl}
      alt={`UPI QR for ₹${amount}`}
      className="w-full h-full object-contain rounded"
    />
  );
}


function SupportPage() {
  const [selectedAmount, setSelectedAmount] = useState<number>(501);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState<"QR" | "UPI">("QR");
  const [supporterName, setSupporterName] = useState("");
  const [message, setMessage] = useState("");
  const [showAmountPublicly, setShowAmountPublicly] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [supporters, setSupporters] = useState<Supporter[]>([]);
  const [wallPage, setWallPage] = useState(0);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Auto-fetch existing user session if logged in
  useEffect(() => {
    fetch(`${API_BASE}/api/auth/me`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d && d.user && d.user.displayName) {
          setSupporterName((prev) => prev || d.user.displayName);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch supporters from server
  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/api/supporters`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data && data.success && Array.isArray(data.supporters)) {
          setSupporters(data.supporters);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const activeAmount = customAmount ? Math.max(1, parseInt(customAmount, 10) || 0) : selectedAmount;
  const displayAmount = `₹${activeAmount.toLocaleString("en-IN")}`;
  const upiUri = buildUpiUri(activeAmount);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supporterName.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/supporters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: supporterName.trim(),
          amount: activeAmount,
          message: message.trim(),
          showAmount: showAmountPublicly,
        }),
      });
      const data = await res.json();
      setSubmitted(true);
      if (data && data.success) {
        toast.success(`Thank you ${supporterName}! Your submission has been received for admin verification.`);
      } else {
        toast.success(`Thank you ${supporterName}! Details logged.`);
      }
    } catch {
      setSubmitted(true);
      toast.success(`Thank you ${supporterName}! Details logged.`);
    }
  };

  const copyUpi = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
      toast.success("UPI ID copied to clipboard!");
    } catch {
      toast.error("Could not copy — please copy manually: " + UPI_ID);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(upiUri);
      toast.success("UPI payment link copied.");
    } catch {
      toast.error("Could not copy link.");
    }
  };

  return (
    <main className="min-h-screen px-3 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Top Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm font-hand text-muted-foreground">
          <Link to="/" className="text-primary hover:underline flex items-center gap-1 font-bold">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
          <span>/</span>
          <span className="text-foreground font-bold">Support the Developer</span>
        </nav>

        {/* Notebook Main Sheet */}
        <article className="notebook relative p-4 sm:p-8 md:p-10 shadow-lg space-y-10 font-hand text-foreground leading-relaxed">
          <div className="tape absolute -top-3 left-1/2 h-6 w-36 -translate-x-1/2 rotate-[-1deg]" />

          {/* PAGE HEADER */}
          <header className="border-b-2 border-foreground/20 pb-6 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-block bg-highlight px-3 py-1 rounded-sm text-xs font-bold border border-foreground/30 uppercase tracking-wider">
                Voluntary Developer Support
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                Effective 2026 · UPI India
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display text-foreground font-bold tracking-tight">
              Support the <span className="underline decoration-primary">Developer ☕</span>
            </h1>
            <p className="text-base sm:text-lg text-primary font-bold max-w-2xl">
              Independent game development and maintenance for Imposter World. Voluntary support
              keeps the hosting active, the multiplayer WebSocket servers online 24/7, and classroom
              party gaming completely free for everyone.
            </p>
          </header>

          {/* SECTION 1 & 2: SEND SUPPORT & JOIN THE WALL */}
          <div className="grid gap-8 lg:grid-cols-2 items-start">
            {/* 01: SEND SUPPORT */}
            <div className="space-y-4">
              <h2 className="font-display text-2xl uppercase flex items-center gap-2 text-foreground font-bold">
                <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded text-sm font-sans font-bold">
                  01
                </span>
                Send Support
              </h2>

              <div className="sketch bg-card/90 p-5 sm:p-6 space-y-5 border-2 border-foreground">
                <div className="border-b border-foreground/20 pb-3">
                  <h3 className="font-display text-xl font-bold text-foreground">
                    Support Aditya Sharma
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Choose Your Support Contribution (INR)
                  </p>
                </div>

                {/* TIER TILES */}
                <div className="grid grid-cols-3 gap-2">
                  {TIERS.map((opt) => {
                    const active = selectedAmount === opt.amount && !customAmount;
                    return (
                      <button
                        key={opt.amount}
                        type="button"
                        onClick={() => {
                          setSelectedAmount(opt.amount);
                          setCustomAmount("");
                        }}
                        className={`flex flex-col items-start p-2 rounded border-2 transition text-left cursor-pointer ${
                          active
                            ? "border-primary bg-highlight/80 shadow-[2px_2px_0_0_rgba(0,0,0,1)] scale-[1.02]"
                            : "border-foreground/30 bg-white/70 hover:border-foreground"
                        }`}
                      >
                        <span className="font-display text-sm sm:text-base font-bold text-foreground leading-tight">
                          <span className="mr-1">{opt.icon}</span>₹{opt.amount}
                        </span>
                        <span className="text-[10px] sm:text-xs text-muted-foreground truncate w-full">
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* CUSTOM AMOUNT INPUT */}
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">
                    Or Enter Custom Amount (INR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-display text-lg font-bold text-foreground">
                      ₹
                    </span>
                    <input
                      type="number"
                      min={1}
                      value={customAmount}
                      onChange={(e) => {
                        const v = parseInt(e.target.value, 10);
                        setCustomAmount(isNaN(v) || v < 0 ? "" : String(v));
                      }}
                      placeholder="e.g. 500"
                      className="w-full bg-white/90 border-2 border-foreground/40 pl-8 pr-3 py-2 text-sm font-hand rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-bold"
                    />
                  </div>
                </div>

                {/* PAYMENT CHANNEL TOGGLE */}
                <div>
                  <div className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">
                    Payment Channel
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(["QR", "UPI"] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setPaymentMode(mode)}
                        className={`py-2 px-3 border-2 font-display text-sm font-bold uppercase tracking-wider transition-colors rounded flex items-center justify-center gap-1.5 cursor-pointer ${
                          paymentMode === mode
                            ? "border-foreground bg-primary text-primary-foreground shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
                            : "border-foreground/30 bg-white/80 text-foreground hover:border-foreground"
                        }`}
                      >
                        {mode === "UPI" ? (
                          <>
                            <Smartphone className="h-4 w-4" /> UPI ID (India)
                          </>
                        ) : (
                          <>
                            <QrCode className="h-4 w-4" /> Scan QR Code
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* QR OR UPI DISPLAY */}
                {paymentMode === "UPI" ? (
                  <div className="border-2 border-foreground bg-white/90 p-4 rounded space-y-3">
                    <div className="text-xs font-bold text-accent uppercase tracking-wider">
                      Pay to UPI · {displayAmount}
                    </div>
                    <div className="font-display text-2xl font-bold select-all break-all text-foreground bg-highlight/30 p-2 rounded border border-foreground/20">
                      {UPI_ID}
                    </div>
                    <div className="text-xs text-muted-foreground font-bold">{DEV_NAME}</div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={copyUpi}
                        className="bg-primary text-primary-foreground py-2.5 px-3 rounded font-display uppercase tracking-wider text-xs font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
                      >
                        {copiedUpi ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        {copiedUpi ? "Copied!" : "Copy UPI ID"}
                      </button>
                      <a
                        href={upiUri}
                        className="border-2 border-foreground bg-white text-foreground py-2.5 px-3 rounded font-display uppercase tracking-wider text-xs font-bold hover:bg-foreground hover:text-white transition-colors text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> Open in UPI App
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={copyLink}
                      className="w-full text-[11px] text-muted-foreground hover:text-primary text-left break-all underline cursor-pointer mt-1"
                    >
                      {upiUri}
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-foreground bg-white/90 p-4 text-center space-y-3 rounded">
                    <div className="text-xs font-bold text-accent uppercase tracking-wider">
                      Scan to Pay {displayAmount}
                    </div>
                    <div className="mx-auto w-52 h-52 sm:w-56 sm:h-56 border-2 border-foreground bg-white p-2 rounded shadow-inner">
                      <UpiQr amount={activeAmount} />
                    </div>
                    <div className="text-xs font-bold text-muted-foreground">
                      PhonePe · GPay · Paytm · BHIM UPI
                    </div>
                    <div className="text-xs">
                      Paying to <span className="text-foreground font-bold">{PAYEE_NAME}</span> ·{" "}
                      <span className="font-mono select-all font-bold text-primary">{UPI_ID}</span>
                    </div>
                    <a
                      href={upiUri}
                      className="inline-flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground py-2.5 rounded font-display uppercase tracking-wider text-xs font-bold hover:bg-primary/90 transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
                    >
                      <Smartphone className="h-4 w-4" /> Open UPI App · {displayAmount}
                    </a>
                  </div>
                )}

                {/* UPI RISK WARNING NOTE */}
                <div className="border border-accent/40 bg-accent/10 p-3 rounded text-xs text-foreground leading-relaxed flex items-start gap-2.5">
                  <AlertTriangle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-accent">If your UPI app shows a warning:</span>{" "}
                    Some banking apps show <em>"This payment may fail as per UPI risk policy"</em> for
                    newer merchant VPA handles. To pay safely, scan the QR code directly inside
                    Google Pay, PhonePe, or Paytm, or enter the UPI ID{" "}
                    <span className="font-bold underline">{UPI_ID}</span> manually.
                  </div>
                </div>
              </div>

              {/* IMPORTANT NOTICE CARD */}
              <section className="sketch bg-highlight/30 p-4 sm:p-5 border border-foreground/40 space-y-2">
                <div className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
                  <ShieldCheck className="h-5 w-5 text-primary" /> Important Notice
                </div>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Payments go directly to the independent website developer.</li>
                  <li>Funds cover servers, domains, and site maintenance only.</li>
                  <li>Not eligible for Section 80G tax deduction.</li>
                  <li>No refunds — voluntary support contribution only.</li>
                  <li>All infrastructure costs are publicly disclosed below.</li>
                </ul>
              </section>
            </div>

            {/* 02: JOIN THE SUPPORTER WALL */}
            <div className="space-y-4">
              <h2 className="font-display text-2xl uppercase flex items-center gap-2 text-foreground font-bold">
                <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded text-sm font-sans font-bold">
                  02
                </span>
                Join The Supporter Wall
              </h2>

              <div className="sketch bg-card/90 p-5 sm:p-6 border-2 border-foreground space-y-4">
                {submitted ? (
                  <div className="border-2 border-primary bg-primary/10 p-6 text-center space-y-2 rounded">
                    <div className="font-display text-2xl font-bold text-primary">
                      Thank you, {supporterName}! 🎉
                    </div>
                    <p className="text-sm text-foreground">
                      Your contribution of <strong>{displayAmount}</strong> has been submitted.
                      Once verified by the admin, your name and message will appear on the Supporter Wall below.
                    </p>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded border border-amber-300 mt-1">
                      <span>⏳ Status: Pending Admin Verification</span>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitted(false);
                          setMessage("");
                        }}
                        className="mt-3 text-xs font-bold text-primary hover:underline cursor-pointer"
                      >
                        Submit another message →
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} className="space-y-4">
                    <div className="flex items-center justify-between border-b border-foreground/20 pb-2 text-xs font-bold">
                      <span className="text-muted-foreground uppercase tracking-wider">
                        Public Wall · Optional
                      </span>
                      <span className="text-accent text-sm font-display font-bold">
                        {displayAmount}
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={supporterName}
                        onChange={(e) => setSupporterName(e.target.value.slice(0, 100))}
                        placeholder="e.g. Aditya Sharma"
                        className="w-full bg-white/90 border-2 border-foreground/30 px-3 py-2 text-sm font-hand rounded focus:outline-none focus:border-primary font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">
                        Message for the Developer
                      </label>
                      <textarea
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                        placeholder="Say something nice, suggest a game mode, or send chai love..."
                        className="w-full bg-white/90 border-2 border-foreground/30 p-3 text-sm font-hand rounded focus:outline-none focus:border-primary resize-none"
                      />
                      <div className="text-[11px] text-muted-foreground text-right mt-0.5">
                        {message.length}/500
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="showAmountCheck"
                        checked={showAmountPublicly}
                        onChange={(e) => setShowAmountPublicly(e.target.checked)}
                        className="rounded border-foreground text-primary focus:ring-primary h-4 w-4"
                      />
                      <label
                        htmlFor="showAmountCheck"
                        className="text-xs text-muted-foreground font-bold cursor-pointer"
                      >
                        Display contribution amount ({displayAmount}) on the wall publicly
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-foreground text-card py-3 rounded font-display uppercase tracking-wider text-sm font-bold hover:bg-primary transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-[2px_2px_0_0_rgba(0,0,0,1)] mt-2"
                    >
                      <Send className="h-4 w-4" /> Submit Support Details →
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 3: SUPPORTER WALL */}
          <section id="wall" className="space-y-5 pt-4 border-t-2 border-foreground/20">
            <div className="border-b border-foreground/20 pb-3">
              <span className="text-xs font-bold text-accent uppercase tracking-wider">
                Supporter Wall
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-1">
                The Chai That Keeps The <span className="text-primary">Lights On 💡</span>
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mt-1">
                Supporters helping cover game server costs, hosting, and domain upkeep. Amounts can
                be private or public — recognition is a thank-you, never an ad.
              </p>
            </div>

            {supporters.length === 0 ? (
              <div className="border-2 border-dashed border-foreground/30 bg-white/60 p-8 sm:p-12 text-center rounded space-y-2">
                <div className="font-display text-4xl text-muted-foreground/40 font-bold">0</div>
                <div className="font-display text-lg font-bold text-foreground">
                  Zero verified supporters so far
                </div>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  The wall is waiting! Send any amount above and add your name to be the very first
                  patron on the leaderboard.
                </p>
              </div>
            ) : (
              (() => {
                const PAGE_SIZE = 9;
                const totalPages = Math.max(1, Math.ceil(supporters.length / PAGE_SIZE));
                const page = Math.min(wallPage, totalPages - 1);
                const slice = supporters.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

                const timeAgo = (iso: string) => {
                  const diff = Date.now() - new Date(iso).getTime();
                  const h = Math.floor(diff / 3_600_000);
                  if (h < 1) return "JUST NOW";
                  if (h < 24) return `${h} HOUR${h === 1 ? "" : "S"} AGO`;
                  const d = Math.floor(h / 24);
                  if (d === 1) return "YESTERDAY";
                  if (d < 30) return `${d} DAYS AGO`;
                  return new Date(iso)
                    .toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                    .toUpperCase();
                };

                return (
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {slice.map((s) => (
                        <div
                          key={s.id}
                          className="sketch bg-card/90 p-4 border border-foreground/40 shadow-[3px_3px_0_0_rgba(0,0,0,1)] flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 shrink-0 border-2 border-foreground bg-highlight flex items-center justify-center font-display text-lg font-bold rounded">
                                {(s.name || "?").trim().charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="font-display text-base font-bold truncate text-foreground">
                                  {s.name}
                                </div>
                                <div className="flex items-center gap-1 text-[11px] text-primary font-bold">
                                  <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />
                                  <span>Verified Supporter</span>
                                </div>
                                <div className="text-[10px] text-muted-foreground">
                                  {timeAgo(s.paid_at)}
                                </div>
                              </div>
                            </div>

                            {s.message && (
                              <div className="mt-3 pl-2.5 border-l-2 border-primary text-xs italic text-foreground/80 break-words">
                                "{s.message}"
                              </div>
                            )}
                          </div>

                          <div className="mt-3 pt-3 border-t border-foreground/15 flex items-center justify-between text-xs font-bold">
                            {s.show_amount && Number(s.amount) > 0 ? (
                              <span className="bg-highlight px-2 py-0.5 rounded border border-foreground/20 text-foreground font-display">
                                ₹{Number(s.amount).toLocaleString("en-IN")}
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-[11px] font-mono">
                                ₹•••• (Private)
                              </span>
                            )}
                            <span className="text-[10px] text-muted-foreground uppercase">
                              Supporter
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setWallPage((p) => Math.max(0, p - 1))}
                          disabled={page === 0}
                          className="border border-foreground px-3 py-1.5 rounded font-display text-xs uppercase tracking-wider hover:bg-foreground hover:text-white disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                        >
                          ← Prev
                        </button>
                        <span className="text-xs text-muted-foreground font-bold">
                          Page {page + 1} of {totalPages}
                        </span>
                        <button
                          type="button"
                          onClick={() => setWallPage((p) => Math.min(totalPages - 1, p + 1))}
                          disabled={page >= totalPages - 1}
                          className="border border-foreground px-3 py-1.5 rounded font-display text-xs uppercase tracking-wider hover:bg-foreground hover:text-white disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                        >
                          Next →
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()
            )}
          </section>

          {/* WHAT SUPPORT DOES NOT PROVIDE (GAME ADAPTED) */}
          <section className="space-y-3 pt-4 border-t-2 border-foreground/20">
            <h2 className="font-display text-2xl uppercase border-b border-foreground/20 pb-2 text-foreground font-bold">
              What Your Support Does <span className="text-accent">NOT</span> Provide
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              Supporting the developer is a friendly thank-you, not an in-game purchase. To keep Imposter World 100% fair, transparent, and fun for all players, your voluntary support does not provide:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs pt-1">
              {[
                "Guaranteed Detective or Imposter role",
                "Secret word peek or clue leak cheats",
                "Unfair gameplay advantages or powerups",
                "Pay-to-win leaderboard rank boosts",
                "Room kick/ban moderation immunity",
                "Commercial ads or sponsor banners",
                "Game ownership or rule influence",
                "Compulsory paid features (100% free to play)",
              ].map((x) => (
                <div
                  key={x}
                  className="p-2.5 border border-foreground/25 bg-white/70 rounded flex items-center gap-2 font-bold"
                >
                  <X className="h-3.5 w-3.5 text-accent shrink-0 font-bold" />
                  <span className="text-foreground">{x}</span>
                </div>
              ))}
            </div>
          </section>

          {/* FINANCIAL & LEGAL NOTICE */}
          <section className="sketch bg-card/90 p-5 sm:p-7 border border-foreground/40 space-y-4">
            <h3 className="font-display text-xl uppercase font-bold text-foreground border-b border-foreground/20 pb-2">
              Financial &amp; Legal Notice
            </h3>
            <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
              All payments made through this page are received directly by:
            </p>
            <div className="p-3 border border-foreground/30 bg-white/90 rounded">
              <div className="font-display text-xl font-bold text-foreground">{PAYEE_NAME}</div>
              <div className="text-xs text-muted-foreground font-bold">
                Independent Website &amp; Game Developer
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Accepted Payment Channels
              </div>
              <ul className="list-disc list-inside text-xs text-foreground/80">
                <li>UPI (India) — GPay, PhonePe, Paytm, BHIM</li>
              </ul>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Purpose of Voluntary Support Payments
              </div>
              <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-foreground/80 list-disc list-inside">
                <li>Website development</li>
                <li>Website maintenance</li>
                <li>Hosting &amp; servers</li>
                <li>Domain renewals</li>
                <li>Infrastructure</li>
                <li>Security improvements</li>
                <li>Performance optimizations</li>
                <li>New game modes &amp; features</li>
              </ul>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed pt-2">
              These voluntary support payments are intended solely to cover the costs of developing
              and maintaining this website. This page does not collect payments on behalf of any
              registered political party, election campaign, charitable trust, NGO, or other
              organization.
            </p>

            <div className="grid sm:grid-cols-2 gap-2 pt-2 text-xs">
              <div className="p-3 border border-foreground/20 bg-white/70 rounded">
                <span className="font-display text-sm font-bold block text-foreground">
                  No Tax Benefit
                </span>
                <span className="text-muted-foreground mt-0.5 block text-[11px]">
                  Voluntary payments are not eligible for tax deductions under Section 80G.
                </span>
              </div>
              <div className="p-3 border border-foreground/20 bg-white/70 rounded">
                <span className="font-display text-sm font-bold block text-foreground">No GST</span>
                <span className="text-muted-foreground mt-0.5 block text-[11px]">
                  No GST invoice is issued for voluntary personal support contributions.
                </span>
              </div>
            </div>
          </section>

          {/* SECTION 7: FAQ ACCORDION */}
          <section className="space-y-3 pt-2">
            <h2 className="font-display text-2xl uppercase border-b border-foreground/20 pb-2 text-foreground font-bold">
              Frequently Asked Questions
            </h2>
            <div className="divide-y divide-foreground/20 border border-foreground/30 bg-white/70 rounded overflow-hidden">
              {[
                {
                  q: "Is this a political donation?",
                  a: "No. This is a voluntary contribution to the independent website developer to cover hosting, multiplayer servers, and maintenance.",
                },
                {
                  q: "Is this a registered political party?",
                  a: "No. Imposter World is an independent educational party game project, not a political party or commercial enterprise.",
                },
                {
                  q: "Is this a charity or NGO?",
                  a: "No. Payments are personal voluntary support to the creator and are not collected on behalf of any trust or NGO.",
                },
                {
                  q: "Who receives the payment?",
                  a: `${PAYEE_NAME} — the independent website and game developer.`,
                },
                {
                  q: "Will I become a member?",
                  a: "No. Support does not grant party membership, voting rights, or special administrative privileges.",
                },
                {
                  q: "What am I supporting?",
                  a: "Multiplayer WebSocket servers, database maintenance, cloud domain costs, and new game features.",
                },
                {
                  q: "Is payment required to play?",
                  a: "No! Imposter World is 100% free to play with your friends, classmates, and family.",
                },
                {
                  q: "Will I receive anything in return?",
                  a: "No goods or services. Optionally, your name appears on the public Supporter Wall as a token of gratitude.",
                },
                {
                  q: "Can businesses sponsor or advertise?",
                  a: "No. This website is ad-free and does not host commercial sponsorships.",
                },
                {
                  q: "Can I contribute from outside India?",
                  a: "Currently only UPI (India) is enabled. International channels may be added later.",
                },
                {
                  q: "Is this tax deductible?",
                  a: "No. Voluntary support payments are not eligible for Section 80G or any similar tax rebate.",
                },
                {
                  q: "Can I request removal from the Supporter Wall?",
                  a: "Yes. Drop an email to hello@imposterworld.xyz with your name and we will happily remove your entry.",
                },
              ].map((f) => (
                <details key={f.q} className="group p-3 sm:p-4">
                  <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-foreground text-sm sm:text-base">
                    <span>{f.q}</span>
                    <span className="text-primary font-display text-xl group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* SECTION 8: SUPPORT & REFUND POLICY */}
          <section className="grid md:grid-cols-2 gap-4 pt-2">
            <div className="sketch bg-white/70 p-4 border border-foreground/30 space-y-2">
              <div className="font-display text-lg font-bold uppercase text-foreground border-b border-foreground/20 pb-1">
                Support Policy
              </div>
              <div className="text-xs text-muted-foreground space-y-1.5 leading-relaxed">
                <p>
                  Supporting the developer is completely optional. Imposter World remains freely
                  accessible whether or not you choose to contribute.
                </p>
                <p>
                  Voluntary support payments are used solely for game development, hosting,
                  domains, infrastructure, security, and future gameplay improvements.
                </p>
                <p>
                  Please verify the payee name <strong>{PAYEE_NAME}</strong> in your UPI app before
                  confirming payment.
                </p>
              </div>
            </div>

            <div className="sketch bg-white/70 p-4 border border-foreground/30 space-y-2">
              <div className="font-display text-lg font-bold uppercase text-foreground border-b border-foreground/20 pb-1">
                Refund Policy
              </div>
              <div className="text-xs text-muted-foreground space-y-1.5 leading-relaxed">
                <p>
                  Support contributions are voluntary gifts and are generally non-refundable.
                </p>
                <p>
                  If you made an accidental payment or wrong amount, contact the developer within 7
                  days at{" "}
                  <a href="mailto:hello@imposterworld.xyz" className="text-primary underline font-bold">
                    hello@imposterworld.xyz
                  </a>{" "}
                  with your UPI transaction ID (UTR).
                </p>
              </div>
            </div>
          </section>

          {/* BOTTOM NAVIGATION FOOTER */}
          <footer className="border-t-2 border-foreground/20 pt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-xs sm:text-sm font-bold text-primary">
            <Link to="/" className="hover:underline hover:text-accent">
              Play Imposter World
            </Link>
            <span className="text-muted-foreground/60">·</span>
            <Link to="/how-to-play" className="hover:underline hover:text-accent">
              How To Play Imposter World
            </Link>
            <span className="text-muted-foreground/60">·</span>
            <Link to="/articles" className="hover:underline hover:text-accent">
              Game Strategy Articles
            </Link>
            <span className="text-muted-foreground/60">·</span>
            <Link to="/notice-board" className="hover:underline hover:text-accent">
              Notice Board
            </Link>
            <span className="text-muted-foreground/60">·</span>
            <Link to="/support" className="hover:underline hover:text-accent text-accent">
              Support the Dev
            </Link>
            <span className="text-muted-foreground/60">·</span>
            <Link to="/terms" className="hover:underline hover:text-accent">
              Terms of Use
            </Link>
            <span className="text-muted-foreground/60">·</span>
            <Link to="/privacy" className="hover:underline hover:text-accent">
              Privacy Policy
            </Link>
            <span className="text-muted-foreground/60">·</span>
            <Link to="/delete-account" className="hover:underline hover:text-accent">
              Delete Account
            </Link>
          </footer>
        </article>
      </div>
    </main>
  );
}
