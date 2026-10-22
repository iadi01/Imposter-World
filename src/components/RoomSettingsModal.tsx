import { useState } from "react";
import { Settings, X, Check, Volume2, VolumeX, Music } from "lucide-react";

export interface GameSettingsData {
  capacity: number;
  language: string;
  drawTime: number;
  rounds: number;
  gameMode: "normal" | "double_imposter" | "word_guess";
  wordCount: number;
  hintsCount: number;
  isPublic: boolean;
  category?: string | undefined;
  difficulty?: ("easy" | "medium" | "hard" | "all") | undefined;
}

export function RoomSettingsModal({
  initialSettings,
  isHost,
  onSave,
  onClose,
  isMuted,
  isBgmActive,
  currentTrackName,
  onToggleMute,
  onToggleBgm,
  onNextTrack,
  onPrevTrack,
}: {
  initialSettings: GameSettingsData;
  isHost: boolean;
  onSave: (newSettings: Partial<GameSettingsData>) => void;
  onClose: () => void;
  isMuted?: boolean;
  isBgmActive?: boolean;
  currentTrackName?: string;
  onToggleMute?: () => void;
  onToggleBgm?: () => void;
  onNextTrack?: () => void;
  onPrevTrack?: () => void;
}) {
  const [capacity, setCapacity] = useState(initialSettings.capacity);
  const [language, setLanguage] = useState(initialSettings.language);
  const [drawTime, setDrawTime] = useState(initialSettings.drawTime);
  const [rounds, setRounds] = useState(initialSettings.rounds);
  const [gameMode, setGameMode] = useState(initialSettings.gameMode);
  const [wordCount, setWordCount] = useState(initialSettings.wordCount);
  const [hintsCount, setHintsCount] = useState(initialSettings.hintsCount);
  const [isPublic, setIsPublic] = useState(initialSettings.isPublic ?? true);
  const [category, setCategory] = useState(initialSettings.category ?? "All Categories");
  const [difficulty, setDifficulty] = useState(initialSettings.difficulty ?? "all");

  const handleSave = () => {
    onSave({
      capacity,
      language,
      drawTime,
      rounds,
      gameMode,
      wordCount,
      hintsCount,
      isPublic,
      category,
      difficulty,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4 backdrop-blur-xs">
      <div className="notebook relative w-full max-w-lg max-h-[92vh] overflow-y-auto overflow-x-hidden rounded-sm bg-card p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 shadow-2xl">
        {/* Tape decoration */}
        <div className="tape absolute -top-3 left-1/2 h-6 w-32 -translate-x-1/2 rotate-[-2deg]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-2 border-foreground/30 pb-3">
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-accent" />
            <h2 className="text-3xl font-display text-foreground">Room Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 hover:bg-secondary text-foreground"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-hand">
          {/* Players Capacity */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-foreground">Players (3 - 14):</label>
            <select
              value={capacity}
              disabled={!isHost}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="sketch w-full bg-white px-3 py-1.5 text-base text-foreground focus:outline-none disabled:opacity-60"
            >
              {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((num) => (
                <option key={num} value={num}>
                  {num} Players
                </option>
              ))}
            </select>
          </div>

          {/* Language */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-foreground">Language:</label>
            <select
              value={language}
              disabled={!isHost}
              onChange={(e) => setLanguage(e.target.value)}
              className="sketch w-full bg-white px-3 py-1.5 text-base text-foreground focus:outline-none disabled:opacity-60"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi (Beta)</option>
              <option value="Spanish">Spanish</option>
            </select>
          </div>

          {/* Draw Time / Hint Time */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-foreground">Drawtime / Hint Time:</label>
            <select
              value={drawTime}
              disabled={!isHost}
              onChange={(e) => setDrawTime(Number(e.target.value))}
              className="sketch w-full bg-white px-3 py-1.5 text-base text-foreground focus:outline-none disabled:opacity-60"
            >
              {[30, 45, 60, 80, 100, 120].map((sec) => (
                <option key={sec} value={sec}>
                  {sec} seconds
                </option>
              ))}
            </select>
          </div>

          {/* Rounds */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-foreground">Rounds:</label>
            <select
              value={rounds}
              disabled={!isHost}
              onChange={(e) => setRounds(Number(e.target.value))}
              className="sketch w-full bg-white px-3 py-1.5 text-base text-foreground focus:outline-none disabled:opacity-60"
            >
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>
                  {r} {r === 1 ? "Round" : "Rounds"}
                </option>
              ))}
            </select>
          </div>

          {/* Game Mode */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-foreground">Game Mode:</label>
            <select
              value={gameMode}
              disabled={!isHost}
              onChange={(e) => setGameMode(e.target.value as any)}
              className="sketch w-full bg-white px-3 py-1.5 text-base text-foreground focus:outline-none disabled:opacity-60"
            >
              <option value="normal">Normal (1 Imposter)</option>
              <option value="double_imposter">Double Imposter (5+ players)</option>
              <option value="word_guess">Word Guess Mode</option>
            </select>
          </div>

          {/* Word Count */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-foreground">Word Count:</label>
            <select
              value={wordCount}
              disabled={!isHost}
              onChange={(e) => setWordCount(Number(e.target.value))}
              className="sketch w-full bg-white px-3 py-1.5 text-base text-foreground focus:outline-none disabled:opacity-60"
            >
              <option value={1}>1 Pair</option>
              <option value={2}>2 Pairs</option>
            </select>
          </div>

          {/* Hints */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-foreground">Hints per player:</label>
            <select
              value={hintsCount}
              disabled={!isHost}
              onChange={(e) => setHintsCount(Number(e.target.value))}
              className="sketch w-full bg-white px-3 py-1.5 text-base text-foreground focus:outline-none disabled:opacity-60"
            >
              <option value={1}>1 Hint</option>
              <option value={2}>2 Hints</option>
            </select>
          </div>

          {/* Word Category */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-foreground">Word Category:</label>
            <select
              value={category}
              disabled={!isHost}
              onChange={(e) => setCategory(e.target.value)}
              className="sketch w-full bg-white px-3 py-1.5 text-base text-foreground focus:outline-none disabled:opacity-60"
            >
              <option value="All Categories">🎲 All Categories (Surprise Mix - 7,800+ words)</option>
              <option value="Bollywood Actors">🎬 Bollywood Actors (275 pairs)</option>
              <option value="Bollywood Actresses">💃 Bollywood Actresses (264 pairs)</option>
              <option value="Indian Singers">🎤 Indian Singers (264 pairs)</option>
              <option value="Hollywood Actors">🌟 Hollywood Actors (220 pairs)</option>
              <option value="Movies">🍿 Blockbuster Movies (275 pairs)</option>
              <option value="Web Series">📺 Web Series & OTT (220 pairs)</option>
              <option value="Indian Cities">🏙️ Indian Cities (330 pairs)</option>
              <option value="Countries">🌍 Countries of the World (440 pairs)</option>
              <option value="Landmarks">🏛️ Famous Landmarks (220 pairs)</option>
              <option value="Animals">🐾 Animals (3,300+ pairs)</option>
              <option value="Food & Drinks">🍕 Food & Drinks (2,000+ pairs)</option>
              <option value="Everyday Objects">🎒 Everyday Objects</option>
              <option value="Transport">🚀 Transport & Vehicles</option>
              <option value="Nature & Places">🏔️ Nature & Places</option>
              <option value="Sports & Games">⚽ Sports & Games</option>
              <option value="Professions">👨‍🏫 Professions & Jobs</option>
              <option value="Music & Art">🎨 Music & Art</option>
            </select>
          </div>

          {/* Difficulty */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-foreground">Difficulty:</label>
            <select
              value={difficulty}
              disabled={!isHost}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="sketch w-full bg-white px-3 py-1.5 text-base text-foreground focus:outline-none disabled:opacity-60"
            >
              <option value="all">Any / Mixed</option>
              <option value="easy">Easy (Casual & Fun)</option>
              <option value="medium">Medium (Balanced)</option>
              <option value="hard">Hard (Trickier Clues)</option>
            </select>
          </div>

          {/* Room Privacy (Public vs Private) */}
          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-bold text-foreground block">Room Privacy:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={!isHost}
                onClick={() => setIsPublic(true)}
                className={`sketch p-2.5 text-left text-sm transition-all ${
                  isPublic
                    ? "bg-accent text-accent-foreground font-bold shadow-sm"
                    : "bg-white text-foreground hover:bg-secondary"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  <span>🟢 Public Room</span>
                </div>
                <div className="text-xs opacity-85 pt-0.5">
                  Visible in public lobby list. Anyone can join.
                </div>
              </button>

              <button
                type="button"
                disabled={!isHost}
                onClick={() => setIsPublic(false)}
                className={`sketch p-2.5 text-left text-sm transition-all ${
                  !isPublic
                    ? "bg-primary text-primary-foreground font-bold shadow-sm"
                    : "bg-white text-foreground hover:bg-secondary"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  <span>🔒 Private Room</span>
                </div>
                <div className="text-xs opacity-85 pt-0.5">
                  Hidden. Joinable only via secret link or code.
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Audio & Classroom Lo-Fi Beats */}
        <div className="sketch bg-white/85 p-3.5 space-y-2.5 border-2 border-foreground/30 font-hand">
          <div className="flex items-center justify-between">
            <span className="font-bold text-base text-foreground flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-primary" /> Audio & Sound Effects
            </span>
            <button
              type="button"
              onClick={onToggleMute}
              className={`sketch px-3 py-1 text-xs font-bold flex items-center gap-1 shadow-2xs ${
                isMuted ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"
              }`}
            >
              {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
              {isMuted ? "Unmute Sound" : "Mute Sound"}
            </button>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-foreground/15">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Music className="h-3.5 w-3.5 text-accent" /> Relaxing Lo-Fi Background Music
              </div>
              <div className="text-[11px] text-muted-foreground">
                {isBgmActive ? `Playing: ${currentTrackName || "Study Beats"}` : "Soft nostalgic study ambience (Paused)"}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {isBgmActive && (
                <>
                  <button
                    type="button"
                    onClick={onPrevTrack}
                    className="sketch px-2 py-0.5 text-xs bg-card hover:bg-secondary"
                    title="Previous Track"
                  >
                    ⏮️
                  </button>
                  <button
                    type="button"
                    onClick={onNextTrack}
                    className="sketch px-2 py-0.5 text-xs bg-card hover:bg-secondary"
                    title="Next Track"
                  >
                    ⏭️
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={onToggleBgm}
                className={`sketch px-3 py-1 text-xs font-bold shadow-2xs ${
                  isBgmActive ? "bg-accent text-accent-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                {isBgmActive ? "Pause Music" : "Play Lo-Fi 🎵"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-foreground/30">
          <button
            type="button"
            onClick={onClose}
            className="sketch bg-secondary px-5 py-2 text-base font-bold text-foreground hover:bg-secondary/80"
          >
            Cancel
          </button>
          {isHost && (
            <button
              type="button"
              onClick={handleSave}
              className="sketch flex items-center gap-2 bg-accent px-6 py-2 text-base font-bold text-accent-foreground hover:brightness-110"
            >
              <Check className="h-4 w-4" /> Save Settings
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
