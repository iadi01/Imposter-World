import { useState } from "react";
import { Users, X, RefreshCw, Shield, Plus, Globe } from "lucide-react";
import { sound } from "@/lib/sound";

export interface PublicRoomItem {
  roomCode: string;
  settings: {
    name: string;
    capacity: number;
    language: string;
    gameMode: string;
    drawTime: number;
    rounds: number;
  };
  players: {
    displayName: string;
    isHost: boolean;
  }[];
}

export function PublicRoomsModal({
  rooms,
  onJoinRoom,
  onCreateRoom,
  onRefresh,
  onClose,
}: {
  rooms: PublicRoomItem[];
  onJoinRoom: (roomCode: string) => void;
  onCreateRoom: () => void;
  onRefresh: () => void;
  onClose: () => void;
}) {
  const [filterMode, setFilterMode] = useState<string>("all");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    sound.playPop();
    setRefreshing(true);
    onRefresh();
    setTimeout(() => setRefreshing(false), 500);
  };

  const filtered = rooms.filter((r) => {
    if (filterMode === "all") return true;
    return r.settings.gameMode === filterMode;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4 backdrop-blur-xs">
      <div className="notebook relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-sm bg-card p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5 shadow-2xl">
        <div className="tape absolute -top-3 left-1/2 h-6 w-36 -translate-x-1/2 rotate-[-1deg]" />

        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-foreground/30 pb-3">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
            <h2 className="text-2xl sm:text-3xl font-display text-foreground">Public Classrooms</h2>
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

        {/* Toolbar: Filters & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 font-hand text-sm">
          {/* Mode Filters */}
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-muted-foreground mr-1">MODE:</span>
            {["all", "normal", "double_imposter", "word_guess"].map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  sound.playPop();
                  setFilterMode(mode);
                }}
                className={`sketch px-2.5 py-1 text-xs capitalize ${
                  filterMode === mode
                    ? "bg-accent text-accent-foreground font-bold"
                    : "bg-white text-foreground hover:bg-secondary"
                }`}
              >
                {mode === "all" ? "All" : mode.replace("_", " ")}
              </button>
            ))}
          </div>

          {/* Refresh & Create Room */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="sketch flex items-center gap-1 bg-secondary px-3 py-1 font-bold text-xs hover:bg-secondary/80 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} /> Refresh
            </button>
            <button
              onClick={() => {
                sound.playPop();
                onClose();
                onCreateRoom();
              }}
              className="sketch flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 font-bold text-xs hover:brightness-110"
            >
              <Plus className="h-3.5 w-3.5" /> Host Room
            </button>
          </div>
        </div>

        {/* Rooms List */}
        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 font-hand">
          {filtered.length === 0 ? (
            <div className="sketch bg-white/70 p-8 text-center space-y-3">
              <div className="text-xl font-display text-muted-foreground">
                No active public classrooms found right now. 📭
              </div>
              <p className="text-xs text-muted-foreground">
                Be the first teacher! Create a public room and students will join instantly.
              </p>
              <button
                onClick={() => {
                  sound.playPop();
                  onClose();
                  onCreateRoom();
                }}
                className="sketch bg-accent text-accent-foreground px-5 py-2 font-bold text-sm"
              >
                Create Public Room 🚀
              </button>
            </div>
          ) : (
            filtered.map((r) => {
              const hostName = r.players.find((p) => p.isHost)?.displayName || "Host";
              const isFull = r.players.length >= r.settings.capacity;

              return (
                <div
                  key={r.roomCode}
                  className="sketch bg-white/90 p-3.5 flex items-center justify-between gap-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-accent/20 border border-foreground/30 flex items-center justify-center font-bold text-accent font-display text-lg">
                      {hostName.charAt(0).toUpperCase()}
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-foreground truncate">
                          {r.settings.name || `${hostName}'s Room`}
                        </span>
                        <span className="rounded bg-secondary px-1.5 text-[10px] font-bold text-muted-foreground uppercase border border-line">
                          #{r.roomCode}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 pt-0.5">
                        <span>Host: {hostName}</span>
                        <span>•</span>
                        <span className="capitalize">{r.settings.gameMode.replace("_", " ")}</span>
                        <span>•</span>
                        <span>{r.settings.language}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="font-display text-lg font-bold text-primary flex items-center gap-1 justify-end">
                        <Users className="h-4 w-4" />
                        <span>
                          {r.players.length}/{r.settings.capacity}
                        </span>
                      </div>
                      <div className="text-[10px] text-muted-foreground font-bold">
                        {isFull ? "FULL" : "JOINABLE"}
                      </div>
                    </div>

                    <button
                      disabled={isFull}
                      onClick={() => {
                        sound.playPop();
                        onJoinRoom(r.roomCode);
                        onClose();
                      }}
                      className="sketch bg-accent text-accent-foreground px-4 py-1.5 font-bold text-sm disabled:opacity-40 hover:brightness-110"
                    >
                      {isFull ? "Full" : "Join"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t-2 border-foreground/30 flex justify-between items-center text-xs text-muted-foreground font-hand">
          <span>Tip: Private rooms do not appear here and require an invite link.</span>
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="sketch bg-secondary px-4 py-1.5 text-sm font-bold text-foreground hover:bg-secondary/80"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
