import React, { useEffect, useState } from "react";
import { sound } from "@/lib/sound";

interface ClassroomJoiningOverlayProps {
  roomCode: string;
  onCancel: () => void;
}

const CLASSROOM_QUOTES = [
  "🎒 'May I come in, Teacher?' 🏃‍♂️",
  "✏️ Sharpening detective pencils and opening notebook...",
  "🪑 Finding an empty front-row desk...",
  "🔔 Waiting for the school bell to ring...",
  "📋 Checking attendance register...",
];

export function ClassroomJoiningOverlay({ roomCode, onCancel }: ClassroomJoiningOverlayProps) {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % CLASSROOM_QUOTES.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="notebook relative max-w-md w-full p-6 sm:p-8 text-center space-y-6 shadow-2xl border-2 border-foreground/30 bg-background animate-in zoom-in-95 duration-200">
        <div className="tape absolute -top-3 left-1/2 -translate-x-1/2 h-6 w-32 rotate-[-1deg]" />

        {/* Animated Mascot / Backpack */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping" />
          <span className="text-6xl animate-bounce select-none">🎒</span>
          <span className="text-2xl absolute -bottom-1 -right-1 animate-pulse select-none">🏃‍♂️</span>
        </div>

        {/* Classroom Header */}
        <div className="space-y-2">
          <div className="sketch inline-block bg-accent text-accent-foreground px-3.5 py-1 text-xs font-bold font-mono uppercase tracking-wider shadow-xs">
            Classroom Room #{roomCode}
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            "May I come in, Teacher?" 🙋‍♂️
          </h2>
          <p className="text-sm font-hand text-muted-foreground font-bold transition-all duration-300 min-h-[24px]">
            {CLASSROOM_QUOTES[quoteIndex]}
          </p>
        </div>

        {/* Notebook Style Progress Bar */}
        <div className="sketch bg-white/95 p-3.5 text-xs font-mono space-y-2 border border-foreground/20 text-left shadow-xs">
          <div className="flex items-center justify-between text-primary font-bold">
            <span className="flex items-center gap-1.5">
              <span className="animate-spin text-sm">⏳</span>
              <span>Connecting to classroom desk...</span>
            </span>
            <span className="text-[11px] font-mono text-muted-foreground">&lt; 20ms join</span>
          </div>
          <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden relative">
            <div
              className="bg-accent h-full rounded-full transition-all duration-500 animate-pulse"
              style={{ width: "90%" }}
            />
          </div>
        </div>

        {/* Cancel Button */}
        <div>
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              onCancel();
            }}
            className="text-xs font-hand text-muted-foreground underline hover:text-foreground font-bold transition-colors"
          >
            Wrong classroom? Return to Hallway 🚪
          </button>
        </div>
      </div>
    </div>
  );
}
