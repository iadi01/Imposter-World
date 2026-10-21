import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/api/auth/google/callback")({
  component: GoogleCallbackPage,
});

function GoogleCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const error = params.get("error");

    if (error) {
      setStatus("error");
      setErrorMessage(`Google sign-in was cancelled or denied: ${error}`);
      return;
    }

    if (!code) {
      setStatus("error");
      setErrorMessage("Missing authorization code from Google.");
      return;
    }

    // Exchange code with backend
    fetch("http://localhost:4001/api/auth/google/callback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ code }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to authenticate with Google.");
        }
        setStatus("success");
        // Redirect to homepage after brief moment
        setTimeout(() => {
          window.location.href = "/?login=success";
        }, 300);
      })
      .catch((err) => {
        console.error("[OAuth] Exchange error:", err);
        setStatus("error");
        setErrorMessage(err.message || "Failed to complete Google verification.");
      });
  }, [navigate]);

  return (
    <main className="min-h-screen flex items-center justify-center p-4 font-hand">
      <div className="notebook relative max-w-md w-full p-6 sm:p-8 rounded shadow-2xl text-center space-y-4">
        <div className="tape absolute -top-3 left-1/2 h-6 w-32 -translate-x-1/2 rotate-[-1deg]" />

        {status === "loading" && (
          <div className="space-y-3 py-6">
            <Loader2 className="h-10 w-10 animate-spin text-accent mx-auto" />
            <h2 className="text-2xl font-display text-foreground font-bold">
              Verifying Google Credentials... 🕵️
            </h2>
            <p className="text-sm text-muted-foreground">
              Please wait while we log you into Imposter World and unlock your dossier.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-3 py-6">
            <div className="text-4xl">✅</div>
            <h2 className="text-2xl font-display text-emerald-700 font-bold">
              Verified Successfully!
            </h2>
            <p className="text-sm text-muted-foreground">Redirecting to classroom dashboard...</p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4 py-4">
            <div className="sketch bg-rose-50 border border-rose-300 p-4 rounded text-left space-y-2">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-base">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>Google Verification Failed</span>
              </div>
              <p className="text-xs text-rose-900 font-sans">{errorMessage}</p>
              <div className="text-[11px] text-muted-foreground pt-1 border-t border-rose-200">
                Note: In Google Cloud Console Testing mode, your email must be added to <strong>Test Users</strong> on the OAuth consent screen.
              </div>
            </div>

            <button
              onClick={() => (window.location.href = "/")}
              className="sketch w-full bg-secondary py-2 text-sm font-bold text-foreground hover:bg-secondary/80 flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" /> Return to Classroom
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
