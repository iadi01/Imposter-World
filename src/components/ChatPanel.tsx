import { useState, useRef, useEffect } from "react";
import { Send, Lock, UserCheck, ShieldAlert } from "lucide-react";

export interface ChatMsg {
  id: string;
  playerId: string;
  playerName: string;
  content: string;
  timestamp: number;
  isSystem?: boolean;
}

interface PlayerOption {
  socketId: string;
  displayName: string;
  avatarUrl?: string;
}

export function ChatPanel({
  messages,
  onSendMessage,
  phase,
  players,
  currentSocketId,
  hasSubmittedAnswer,
  onSubmitAnswer,
  submissionCount,
  totalEligible,
}: {
  messages: ChatMsg[];
  onSendMessage: (text: string) => void;
  phase: string;
  players: PlayerOption[];
  currentSocketId: string;
  hasSubmittedAnswer: boolean;
  onSubmitAnswer: (suspectId: string) => void;
  submissionCount: number;
  totalEligible: number;
}) {
  const [inputText, setInputText] = useState("");
  const [selectedSuspect, setSelectedSuspect] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  const handleSecretSubmit = () => {
    if (!selectedSuspect) return;
    onSubmitAnswer(selectedSuspect);
  };

  return (
    <div className="sketch flex flex-col h-[400px] sm:h-[480px] w-full rounded-md bg-card/90 overflow-hidden border-2 border-foreground shadow-md">
      {/* Header */}
      <div className="bg-primary px-4 py-2 text-primary-foreground flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold font-display tracking-wide">
            {phase === "answer_submission" ? "Secret Guessing" : "Classroom Discussion"}
          </span>
        </div>
        <span className="text-xs bg-primary-foreground/20 px-2 py-0.5 rounded font-hand">
          {phase === "answer_submission"
            ? `${submissionCount}/${totalEligible} Voted`
            : "Live Chat"}
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2.5 font-hand text-base">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground/60 py-10">
            No messages yet. Chat will be lively during discussion! 📝
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.isSystem
                  ? "items-center my-1"
                  : m.playerId === currentSocketId
                  ? "items-end"
                  : "items-start"
              }`}
            >
              {m.isSystem ? (
                <div className="rounded-full bg-secondary/80 px-3 py-1 text-xs text-foreground font-bold shadow-sm border border-line">
                  {m.content}
                </div>
              ) : (
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-1.5 shadow-sm border ${
                    m.playerId === currentSocketId
                      ? "bg-accent text-accent-foreground border-accent-foreground/20 rounded-br-none"
                      : "bg-white text-foreground border-foreground/20 rounded-bl-none"
                  }`}
                >
                  <div className="text-xs font-bold opacity-75 mb-0.5">{m.playerName}</div>
                  <div className="text-sm leading-snug break-words">{m.content}</div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Phase Specific Composer */}
      {phase === "answer_submission" ? (
        <div className="border-t-2 border-foreground bg-highlight/30 p-3 sm:p-4 space-y-2.5">
          <div className="flex items-center justify-between text-foreground font-bold text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 text-accent">
              <Lock className="h-4 w-4" />
              <span>Who is the Imposter?</span>
            </div>
            <span className="text-[11px] font-mono text-muted-foreground">100% Confidential</span>
          </div>

          {hasSubmittedAnswer ? (
            <div className="flex items-center justify-center gap-2 rounded bg-secondary p-3 text-foreground font-bold text-xs sm:text-sm border border-line">
              <UserCheck className="h-4 w-4 text-accent" />
              <span>Secret vote recorded! Waiting for others...</span>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="grid grid-cols-2 gap-1.5 max-h-40 sm:max-h-48 overflow-y-auto pr-1">
                {players
                  .filter((p) => p.socketId !== currentSocketId)
                  .map((p) => {
                    const isSelected = selectedSuspect === p.socketId;
                    return (
                      <button
                        key={p.socketId}
                        type="button"
                        onClick={() => setSelectedSuspect(p.socketId)}
                        className={`sketch flex items-center gap-1.5 p-2 text-left text-xs sm:text-sm font-bold transition-all border ${
                          isSelected
                            ? "bg-accent text-accent-foreground border-accent shadow-xs ring-1 ring-accent"
                            : "bg-white text-foreground border-foreground/30 hover:bg-secondary"
                        }`}
                      >
                        <span className="text-sm shrink-0">{isSelected ? "🎯" : "🕵️"}</span>
                        <span className="truncate">{p.displayName}</span>
                      </button>
                    );
                  })}
              </div>

              <button
                type="button"
                disabled={!selectedSuspect}
                onClick={handleSecretSubmit}
                className="sketch w-full flex items-center justify-center gap-2 bg-accent py-2 text-sm sm:text-base font-bold text-accent-foreground hover:brightness-110 disabled:opacity-40 shadow-xs"
              >
                <Lock className="h-4 w-4" /> Cast Confidential Vote 🗳️
              </button>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSend} className="border-t-2 border-foreground bg-card p-3 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={phase === "discussion" ? "Type your suspicion..." : "Chat during discussion..."}
            disabled={phase !== "discussion"}
            className="sketch flex-1 px-3 py-1.5 text-sm bg-white text-foreground focus:outline-none disabled:opacity-50"
            maxLength={140}
          />
          <button
            type="submit"
            disabled={phase !== "discussion" || !inputText.trim()}
            className="sketch bg-primary px-4 py-1.5 text-primary-foreground font-bold disabled:opacity-40 flex items-center justify-center"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      )}
    </div>
  );
}
