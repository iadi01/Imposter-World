import { X, Pin, Heart } from "lucide-react";
import { sound } from "@/lib/sound";
import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/api";

export function NoticeBoardModal({
  onClose,
  championName,
}: {
  onClose: () => void;
  championName?: string;
}) {
  const [currentBeltHolder, setCurrentBeltHolder] = useState<string>(
    championName || "Loading..."
  );

  useEffect(() => {
    if (championName) {
      setCurrentBeltHolder(championName);
      return;
    }
    fetch(`${API_BASE}/api/leaderboard/champion`)
      .then((r) => r.json())
      .then((d) => {
        if (d && d.success && d.champion) {
          setCurrentBeltHolder(d.champion.name);
        } else {
          setCurrentBeltHolder("Top Detective");
        }
      })
      .catch(() => {
        setCurrentBeltHolder("Top Detective");
      });
  }, [championName]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-3 sm:p-4 backdrop-blur-xs">
      <div className="notebook relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-sm bg-[#FAF4E4] p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 shadow-2xl border-4 border-[#172C53]">
        {/* Tape decoration */}
        <div className="tape absolute -top-4 left-1/2 h-7 w-40 -translate-x-1/2 rotate-[-2deg]" />

        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-foreground/30 pb-3">
          <div className="flex items-center gap-2.5">
            <Pin className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
            <h2 className="text-3xl sm:text-4xl font-display text-foreground tracking-wide">
              Classroom Notice Board 📌
            </h2>
          </div>
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="rounded p-1 hover:bg-secondary text-foreground"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Corkboard / Pinned Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-hand pr-1">
          {/* Note 1: What is Imposter World? */}
          <div className="sketch relative bg-[#FFFBEA] p-4 space-y-2 border-2 border-foreground/40 rotate-[-1deg] shadow-sm overflow-hidden">
            <div className="absolute -top-3 left-6 h-4 w-12 bg-accent/30 rounded-xs rotate-[3deg]" />
            <img
              src="/lightbulb-idea.svg"
              alt="Lightbulb idea"
              className="pointer-events-none absolute -bottom-2 -right-2 h-16 w-16 object-contain opacity-75 rotate-[12deg]"
            />
            <h3 className="text-2xl font-display text-accent flex items-center gap-1.5">
              <span>What Is Imposter World?</span>
            </h3>
            <p className="text-sm leading-relaxed text-foreground relative z-10">
              A social deduction party game made for friends and classrooms! Everyone receives the exact same secret word — except the Imposter, who gets a sneaky lookalike word. Clues are given, debates flare up, and secret votes determine who gets caught!
            </p>
          </div>

          {/* Note 2: Tournament Notice */}
          <div className="sketch relative bg-[#EBF3FF] p-4 space-y-2 border-2 border-foreground/40 rotate-[1deg] shadow-sm overflow-hidden">
            <div className="absolute -top-3 right-6 h-4 w-12 bg-primary/30 rounded-xs rotate-[-3deg]" />
            <img
              src="/paper-plane.svg"
              alt="Paper airplane"
              className="pointer-events-none absolute -bottom-2 -right-1 h-16 w-16 object-contain opacity-75 rotate-[-10deg]"
            />
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-display text-primary">Tournament Desk 🏆</h3>
              <span className="rounded bg-accent text-accent-foreground px-1.5 py-0.5 text-[10px] font-bold">
                NEW
              </span>
            </div>
            <p className="text-sm text-foreground relative z-10">
              <strong>Next one today (Wed):</strong> <br />
              Top detectives clash in the 8-player bracket!
            </p>
            <div className="rounded bg-white/80 p-2 text-xs font-bold text-accent border border-accent/20 relative z-10">
              👑 {currentBeltHolder} currently holds the championship belt!
            </div>
          </div>

          {/* Note 3: Classroom Rules */}
          <div className="sketch relative bg-[#FFF0ED] p-4 space-y-1.5 border-2 border-foreground/40 rotate-[1deg] shadow-sm">
            <div className="absolute -top-3 left-10 h-4 w-14 bg-red-400/30 rounded-xs rotate-[-1deg]" />
            <h3 className="text-2xl font-display text-[#C64132]">Classroom Code 🤫</h3>
            <ul className="text-xs space-y-1 text-foreground list-disc pl-4">
              <li>Never say the secret word directly in your clue!</li>
              <li>Imposters: Act natural and pretend you know the common word.</li>
              <li>Secret votes are strictly confidential before the reveal.</li>
              <li>No phones under the desk cheating! Server anti-cheat is active.</li>
            </ul>
          </div>

          {/* Note 4: Bench Credits */}
          <div className="sketch relative bg-[#F3E8FF] p-4 space-y-2 border-2 border-foreground/40 rotate-[-2deg] shadow-sm flex flex-col justify-between">
            <div className="absolute -top-3 right-8 h-4 w-12 bg-purple-400/30 rounded-xs rotate-[2deg]" />
            <div>
              <h3 className="text-2xl font-display text-purple-900 flex items-center gap-1.5">
                <span>Last Bench Scribble</span> <Heart className="h-4 w-4 text-accent fill-accent" />
              </h3>
              <p className="text-sm italic text-foreground pt-1">
                "made on the last bench by adi and shreya"
              </p>
            </div>
            <div className="text-[11px] text-muted-foreground pt-2">
              Doodled with blue ink and paper textures. Share with your friends! ✨
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t-2 border-foreground/30 flex justify-between items-center font-hand">
          <span className="text-xs text-muted-foreground italic">
            made on the last bench by adi and shreya
          </span>
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="sketch bg-secondary px-5 py-1.5 text-sm font-bold text-foreground hover:bg-secondary/80"
          >
            Close Board
          </button>
        </div>
      </div>
    </div>
  );
}
