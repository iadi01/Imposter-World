import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { DrawPad } from "@/components/DrawPad";
import { ChatPanel, ChatMsg } from "@/components/ChatPanel";
import { RoomSettingsModal, GameSettingsData } from "@/components/RoomSettingsModal";
import { AccountModal, UserProfile } from "@/components/AccountModal";
import { LeaderboardModal } from "@/components/LeaderboardModal";
import { PublicRoomsModal, PublicRoomItem } from "@/components/PublicRoomsModal";
import { NoticeBoardModal } from "@/components/NoticeBoardModal";
import { VoiceClueRecorder, VoiceCluePlayer } from "@/components/VoiceClue";
import { getSocket } from "@/lib/socket";
import { sound } from "@/lib/sound";
import { API_BASE } from "@/lib/api";
import {
  Users,
  Copy,
  Check,
  Settings,
  Trophy,
  User as UserIcon,
  Eye,
  EyeOff,
  Flame,
  ArrowRight,
  Clock,
  Volume2,
  VolumeX,
  Music,
  ShieldAlert,
  Pin,
  Compass,
  Globe,
  Heart,
  Plus,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Imposter World — Real-Time Multiplayer Party Game" },
      {
        name: "description",
        content:
          "A classroom notebook multiplayer party word game. Find the imposter before time runs out!",
      },
    ],
  }),
  component: Index,
});

function Btn({
  children,
  onClick,
  variant = "primary",
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "accent" | "ghost" | "secondary";
  disabled?: boolean;
  className?: string;
}) {
  const styles = {
    primary: "bg-primary text-primary-foreground",
    accent: "bg-accent text-accent-foreground",
    ghost: "bg-card text-foreground",
    secondary: "bg-secondary text-foreground",
  }[variant];

  return (
    <button
      disabled={disabled}
      onClick={() => {
        sound.playPop();
        onClick?.();
      }}
      className={`sketch ${styles} px-6 py-2.5 text-lg font-bold transition-transform hover:-translate-y-0.5 hover:rotate-[-1deg] active:translate-y-0.5 disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  );
}

function Index() {
  // Navigation & Modals
  const [showSettings, setShowSettings] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showPublicRooms, setShowPublicRooms] = useState(false);
  const [showNoticeBoard, setShowNoticeBoard] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Audio Engine State (Default ON)
  const [isMuted, setIsMuted] = useState(sound.isMuted);
  const [isBgmActive, setIsBgmActive] = useState(!sound.isMuted);
  const [championName, setChampionName] = useState<string>("Loading...");

  // Authenticated User
  const [user, setUser] = useState<UserProfile | null>(null);

  // Room & Online Game State
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const [roomState, setRoomState] = useState<any>(null);
  const [secretInfo, setSecretInfo] = useState<{ word: string; role: string } | null>(null);
  const [showSecretWord, setShowSecretWord] = useState(true);
  const [clueType, setClueType] = useState<"text" | "draw" | "voice">("text");
  const [textClueInput, setTextClueInput] = useState("");
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState(false);
  const [publicRooms, setPublicRooms] = useState<PublicRoomItem[]>([]);

  // Local Pass-and-Play Mode
  const [isLocalMode, setIsLocalMode] = useState(false);
  const [localPlayers, setLocalPlayers] = useState(["Aarav", "Riya", "Kabir"]);
  const [localNewPlayerName, setLocalNewPlayerName] = useState("");
  const [localRound, setLocalRound] = useState<any>(null);
  const [localTurn, setLocalTurn] = useState(0);
  const [localWordRevealed, setLocalWordRevealed] = useState(false);
  const [localPhase, setLocalPhase] = useState<"lobby" | "reveal" | "discuss" | "vote" | "result">("lobby");
  const [localVotes, setLocalVotes] = useState<{ [name: string]: number }>({});
  const [localScores, setLocalScores] = useState<{ [name: string]: number }>({ Aarav: 0, Riya: 0, Kabir: 0 });
  const [localClueMode, setLocalClueMode] = useState<"text" | "draw">("text");
  const [localDrawing, setLocalDrawing] = useState<string | null>(null);
  const [localClues, setLocalClues] = useState<{ name: string; type: "text" | "draw"; content: string }[]>([]);
  const [localTextClue, setLocalTextClue] = useState("");

  // Server Authoritative Countdown Timer
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [currentTrack, setCurrentTrack] = useState(sound.getCurrentTrack());

  // Subscribe to lo-fi track changes & auto song switch
  useEffect(() => {
    return sound.onTrackChange((_idx, track) => {
      setCurrentTrack(track);
      setIsBgmActive(sound.getBgmStatus());
    });
  }, []);

  // Fetch real tournament belt champion from MongoDB
  useEffect(() => {
    fetch(`${API_BASE}/api/leaderboard/champion`)
      .then((r) => r.json())
      .then((d) => {
        if (d && d.success && d.champion) {
          setChampionName(d.champion.name);
        } else {
          setChampionName("Top Detective");
        }
      })
      .catch(() => setChampionName("Top Detective"));
  }, []);

  // Auto-play sound on first user gesture (Default ON)
  useEffect(() => {
    const handleFirstGesture = () => {
      if (!sound.isMuted) {
        sound.startBgm();
        setIsBgmActive(true);
      }
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
    };

    window.addEventListener("pointerdown", handleFirstGesture, { once: true });
    window.addEventListener("keydown", handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
    };
  }, []);

  // Socket Reference & Auto-join Invite Tracker
  const socketRef = useRef(getSocket());
  const autoJoinAttempted = useRef(false);
  const pendingInviteCode = useRef<string | null>(
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("room")?.trim().toUpperCase() || null
      : null
  );
  const [lobbyTimeLeft, setLobbyTimeLeft] = useState<number | null>(null);

  // Synchronize browser URL query param (?room=CODE) with active roomState
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (roomState?.roomCode) {
      if (url.searchParams.get("room") !== roomState.roomCode) {
        url.searchParams.set("room", roomState.roomCode);
        window.history.replaceState({}, "", `${url.pathname}?${url.searchParams.toString()}`);
      }
    }
  }, [roomState?.roomCode]);

  // Track 240s Room Lobby Countdown
  useEffect(() => {
    if (!roomState || roomState.phase !== "lobby" || !roomState.lobbyDeadline) {
      setLobbyTimeLeft(null);
      return;
    }
    const updateTimer = () => {
      const diff = Math.max(0, Math.ceil((roomState.lobbyDeadline - Date.now()) / 1000));
      setLobbyTimeLeft(diff);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [roomState?.lobbyDeadline, roomState?.phase]);

  // 1. Initial User fetch & authentic session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const googleCode = searchParams.get("code");
      const loginStatus = searchParams.get("login");

      if (googleCode) {
        // Direct OAuth code exchange if redirected to root
        fetch(`${API_BASE}/api/auth/google/callback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ code: googleCode }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.user) {
              setUser(data.user);
              window.history.replaceState({}, document.title, window.location.pathname);
            }
          })
          .catch((err) => console.error("Google code exchange error:", err));
        fetchPublicRooms();
        return;
      }

      if (loginStatus === "success") {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    fetch(`${API_BASE}/api/auth/me`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        } else {
          // No active session: register a fresh authentic guest user
          fetch(`${API_BASE}/api/auth/guest`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ name: "Detective" }),
          })
            .then((r) => r.json())
            .then((gData) => {
              if (gData.user) setUser(gData.user);
            })
            .catch((err) => console.error("Guest login fallback error:", err));
        }
      })
      .catch(() => {
        // Fallback guest creation
        fetch(`${API_BASE}/api/auth/guest`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ name: "Detective" }),
        })
          .then((r) => r.json())
          .then((gData) => {
            if (gData.user) setUser(gData.user);
          })
          .catch((err) => console.error("Guest login fallback error:", err));
      });

    // Fetch initial public rooms
    fetchPublicRooms();
  }, []);

  // Auto-detect invite link (?room=CODE) and join room directly
  useEffect(() => {
    if (typeof window === "undefined" || autoJoinAttempted.current) return;
    const searchParams = new URLSearchParams(window.location.search);
    const cleanCode = searchParams.get("room")?.trim().toUpperCase();
    if (!cleanCode) return;

    if (roomState && roomState.roomCode === cleanCode) {
      return; // Already actively in this room
    }

    autoJoinAttempted.current = true;
    setRoomCodeInput(cleanCode);
    toast.info(`Connecting to Classroom Room #${cleanCode}...`);
    handleJoinRoom(cleanCode);
  }, [user]);

  const fetchPublicRooms = () => {
    fetch(`${API_BASE}/api/rooms/public`)
      .then((res) => res.json())
      .then((data) => {
        if (data.rooms) setPublicRooms(data.rooms);
      })
      .catch(() => {});
  };

  // 2. Socket Listeners
  useEffect(() => {
    const socket = socketRef.current;

    socket.on("room:state", (state: any) => {
      setRoomState(state);
      if (state.phase === "hint_turn") {
        setHasSubmittedAnswer(false);
      }
    });

    socket.on("game:secret-word", (data: { word: string; role: string }) => {
      setSecretInfo(data);
      setShowSecretWord(true);
      sound.playDing();
    });

    socket.on("game:answer-confirmed", () => {
      setHasSubmittedAnswer(true);
      sound.playLock();
    });

    socket.on("chat:new-message", (msg: any) => {
      setRoomState((prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          chatMessages: [...(prev.chatMessages || []), msg],
        };
      });
    });

    socket.on("rooms:public-updated", (rooms: PublicRoomItem[]) => {
      setPublicRooms(rooms);
    });

    socket.on("classroom:announcement", (data: { message: string; from?: string }) => {
      sound.playDing();
      toast(`📢 ${data.from || "Principal Office"}: ${data.message}`, {
        duration: 8000,
      });
    });

    socket.on("room:disbanded", (data: { reason?: string }) => {
      toast.error(data.reason || "This room was closed.");
      setRoomState(null);
      pendingInviteCode.current = null;
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        if (url.searchParams.has("room")) {
          url.searchParams.delete("room");
          const remaining = url.searchParams.toString();
          window.history.replaceState({}, "", remaining ? `${url.pathname}?${remaining}` : url.pathname);
        }
      }
      sound.playError();
    });

    return () => {
      socket.off("room:state");
      socket.off("game:secret-word");
      socket.off("game:answer-confirmed");
      socket.off("chat:new-message");
      socket.off("rooms:public-updated");
      socket.off("classroom:announcement");
      socket.off("room:disbanded");
    };
  }, []);

  // 3. Countdown timer tick & audio cue
  useEffect(() => {
    if (!roomState?.phaseDeadline) {
      setRemainingTime(0);
      return;
    }

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((roomState.phaseDeadline - Date.now()) / 1000));
      setRemainingTime(remaining);
      // Play tick sound in final 5 seconds of phase
      if (remaining > 0 && remaining <= 5) {
        sound.playTick();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [roomState?.phaseDeadline]);

  // Phase change audio fanfare
  useEffect(() => {
    if (roomState?.phase === "results" && roomState?.lastResult) {
      if (roomState.lastResult.winnerTeam === "detectives") {
        sound.playVictory();
      } else {
        sound.playImposterWin();
      }
    } else if (roomState?.phase === "hint_turn") {
      sound.playDing();
    }
  }, [roomState?.phase]);

  // Actions
  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    setIsBgmActive(!muted);
  };

  const handleToggleBgm = () => {
    if (isBgmActive) {
      sound.stopBgm();
      setIsBgmActive(false);
    } else {
      sound.startBgm();
      setIsBgmActive(true);
      setIsMuted(false);
    }
  };

  const handleNextTrack = () => {
    sound.playPop();
    sound.nextTrack();
    if (!isBgmActive) {
      sound.startBgm();
      setIsBgmActive(true);
      setIsMuted(false);
    }
  };

  const handlePrevTrack = () => {
    sound.playPop();
    sound.prevTrack();
    if (!isBgmActive) {
      sound.startBgm();
      setIsBgmActive(true);
      setIsMuted(false);
    }
  };

  const handleCreateRoom = (customSettings?: Partial<GameSettingsData>) => {
    sound.playPop();
    const socket = socketRef.current;
    if (!socket.connected) {
      socket.connect();
    }
    const creatorUser = user || {
      id: socket.id || `guest-${Math.random().toString(36).substring(2, 9)}`,
      displayName: "Detective",
      avatarUrl: "",
    };

    socket.emit(
      "room:create",
      {
        user: { id: creatorUser.id, displayName: creatorUser.displayName, avatarUrl: creatorUser.avatarUrl },
        settings: customSettings,
      },
      (res: any) => {
        if (res && res.success && res.roomCode) {
          if (res.roomState) {
            setRoomState(res.roomState);
          }
          const url = new URL(window.location.href);
          url.searchParams.set("room", res.roomCode);
          window.history.replaceState({}, "", `${url.pathname}?${url.searchParams.toString()}`);
        } else if (res && !res.success) {
          alert(res.error || "Failed to create room");
        }
      }
    );
  };

  const handleJoinRoom = (code: string) => {
    if (!code || !code.trim()) return;
    const cleanCode = code.trim().toUpperCase();
    if (roomState && roomState.roomCode === cleanCode) {
      return;
    }
    sound.playPop();
    const socket = socketRef.current;
    if (!socket.connected) {
      socket.connect();
    }
    const joinUser = user || {
      id: socket.id || `guest-${Math.random().toString(36).substring(2, 9)}`,
      displayName: "Detective",
      avatarUrl: "",
    };

    socket.emit(
      "room:join",
      {
        roomCode: cleanCode,
        user: { id: joinUser.id, displayName: joinUser.displayName, avatarUrl: joinUser.avatarUrl },
      },
      (res: any) => {
        if (res && res.success && res.roomCode) {
          if (res.roomState) {
            setRoomState(res.roomState);
          }
          const url = new URL(window.location.href);
          url.searchParams.set("room", res.roomCode);
          window.history.replaceState({}, "", `${url.pathname}?${url.searchParams.toString()}`);
        } else if (res && !res.success) {
          toast.error(res.error || "Failed to join room");
          pendingInviteCode.current = null;
        }
      }
    );
  };

  const handleInstantMatch = () => {
    sound.playPop();
    const socket = socketRef.current;
    if (!socket.connected) {
      socket.connect();
    }
    const matchUser = user || {
      id: socket.id || `guest-${Math.random().toString(36).substring(2, 9)}`,
      displayName: "Detective",
      avatarUrl: "",
    };

    socket.emit(
      "room:instant-match",
      { user: { id: matchUser.id, displayName: matchUser.displayName, avatarUrl: matchUser.avatarUrl } },
      (res: any) => {
        if (res && res.success && res.roomCode) {
          if (res.roomState) {
            setRoomState(res.roomState);
          }
          const url = new URL(window.location.href);
          url.searchParams.set("room", res.roomCode);
          window.history.replaceState({}, "", `${url.pathname}?${url.searchParams.toString()}`);
        } else if (res && !res.success) {
          alert(res.error || "Instant match failed");
        }
      }
    );
  };

  const handleStartGame = () => {
    sound.playDing();
    socketRef.current.emit("room:start", {}, (res: any) => {
      if (!res.success) {
        alert(res.error || "Cannot start game");
      }
    });
  };

  const handleSubmitTextClue = () => {
    if (!textClueInput.trim()) return;
    sound.playPencil();
    socketRef.current.emit(
      "game:submit-hint",
      { type: "text", content: textClueInput.trim() },
      (res: any) => {
        if (res.success) {
          setTextClueInput("");
        } else {
          alert(res.error || "Failed to submit clue");
        }
      }
    );
  };

  const handleSubmitDrawingClue = (dataUrl: string) => {
    sound.playPencil();
    socketRef.current.emit("game:submit-hint", { type: "drawing", content: dataUrl }, (res: any) => {
      if (res.success) {
        setClueType("text");
      } else {
        alert(res.error || "Failed to submit drawing");
      }
    });
  };

  const handleSubmitVoiceClue = (audioUrl: string, transcript: string) => {
    sound.playDing();
    socketRef.current.emit(
      "game:submit-hint",
      { type: "voice", content: audioUrl, transcript },
      (res: any) => {
        if (res.success) {
          setClueType("text");
        } else {
          alert(res.error || "Failed to submit voice clue");
        }
      }
    );
  };

  const handleSendChatMessage = (text: string) => {
    socketRef.current.emit("chat:send", { content: text });
  };

  const handleSubmitSecretAnswer = (suspectSocketId: string) => {
    sound.playLock();
    socketRef.current.emit("game:submit-answer", { suspectSocketId }, (res: any) => {
      if (!res.success) {
        alert(res.error || "Failed to submit secret answer");
      }
    });
  };

  const handleVoteSkipDiscussion = () => {
    sound.playPop();
    socketRef.current.emit("game:vote-skip-discussion", {}, (res: any) => {
      if (res && res.success) {
        if (res.skipped) {
          toast.success("Majority voted! Moving to secret vote 🗳️");
        } else {
          toast.info("Voted to skip discussion! Waiting for majority ⏭️");
        }
      } else if (res && res.error) {
        toast.error(res.error);
      }
    });
  };

  const handleNextRound = () => {
    sound.playPop();
    socketRef.current.emit("game:next-round", {}, (res: any) => {
      if (!res.success) alert(res.error || "Cannot advance round");
    });
  };

  const handleLeaveRoom = () => {
    sound.playPop();
    socketRef.current.emit("room:leave");
    setRoomState(null);
    setSecretInfo(null);
    pendingInviteCode.current = null;
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("room");
      const remaining = url.searchParams.toString();
      window.history.replaceState({}, "", remaining ? `${url.pathname}?${remaining}` : url.pathname);
    }
  };

  const handleCopyLink = () => {
    if (roomState?.roomCode) {
      sound.playPop();
      navigator.clipboard.writeText(
        `${window.location.origin}/?room=${roomState.roomCode}`
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleGoogleLogin = () => {
    fetch(`${API_BASE}/api/auth/google/url`)
      .then((res) => res.json())
      .then((data) => {
        if (data.url) window.location.href = data.url;
      })
      .catch((err) => console.error(err));
  };

  // Local Pass and Play Handlers
  const startLocalGame = async () => {
    sound.playDing();
    let word = "Pizza";
    let fake = "Burger";
    let cat = "Food & Drinks";

    try {
      const res = await fetch(`${API_BASE}/api/words/random`);
      if (res.ok) {
        const data = await res.json();
        if (data.common && data.imposter) {
          word = data.common;
          fake = data.imposter;
          cat = data.category || "Classroom Secret";
        }
      }
    } catch {
      const fallbackPairs = [
        ["Dog", "Cat", "Animals"],
        ["Elephant", "Giraffe", "Animals"],
        ["Tiger", "Lion", "Animals"],
        ["Pizza", "Burger", "Food & Drinks"],
        ["Coffee", "Tea", "Food & Drinks"],
        ["Doctor", "Nurse", "Professions"],
        ["Cricket", "Baseball", "Sports & Games"],
        ["Guitar", "Violin", "Music & Art"],
        ["Notebook", "Diary", "Everyday Objects"],
      ];
      const pick = fallbackPairs[Math.floor(Math.random() * fallbackPairs.length)]!;
      word = pick[0]!;
      fake = pick[1]!;
      cat = pick[2]!;
    }

    const imposterIdx = Math.floor(Math.random() * localPlayers.length);

    setLocalRound({
      word,
      fake,
      category: cat,
      imposterIdx,
    });
    setLocalTurn(0);
    setLocalWordRevealed(false);
    setLocalClues([]);
    setLocalVotes({});
    setLocalPhase("reveal");
  };

  const currentSocketId = socketRef.current?.id || "";
  const isHost = Boolean(roomState?.players?.find((p: any) => p.socketId === currentSocketId)?.isHost);
  const isMyTurn =
    roomState?.phase === "hint_turn" && roomState?.activePlayerSocketId === currentSocketId;
  const hasVotedSkipDiscussion = Boolean(
    roomState?.skipDiscussionVoters?.includes(currentSocketId)
  );

  return (
    <main className="min-h-screen px-2.5 sm:px-6 md:px-8 py-3 sm:py-6 md:py-10">
      {/* Top Header Navigation */}
      <header className="sketch mx-auto mb-4 sm:mb-6 flex max-w-5xl items-center justify-between border-2 border-foreground bg-white/90 backdrop-blur-md px-2.5 sm:px-5 py-2 sm:py-3 shadow-lg">
        {/* Brand */}
        <div className="flex items-center gap-2 sm:gap-3">
          <img
            src="/detective.png"
            alt="Detective Mascot"
            className="h-9 w-9 sm:h-12 sm:w-12 object-contain hover:scale-105 transition-transform drop-shadow-xs"
          />
          <button
            onClick={() => {
              if (roomState || isLocalMode) {
                if (confirm("Go to homepage? You will leave your current room.")) {
                  handleLeaveRoom();
                  setIsLocalMode(false);
                }
              }
            }}
            className="text-2xl sm:text-3xl md:text-4xl font-display text-left"
          >
            Imposter <span className="text-accent">World</span>
          </button>
        </div>

        {/* Right Header Navigation */}
        <div className="flex items-center flex-nowrap gap-1 sm:gap-2 ml-auto shrink-0">
          {/* Room Pill if in active room */}
          {roomState && (
            <span className="sketch bg-highlight px-2 sm:px-3 py-1 text-xs sm:text-sm md:text-base font-bold flex items-center gap-1.5 shrink-0">
              #{roomState.roomCode}
              <button
                onClick={handleCopyLink}
                title="Copy Room Link"
                className="hover:text-accent ml-1"
              >
                {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </span>
          )}

          {/* Local Mode Pill */}
          {isLocalMode && (
            <span className="sketch bg-secondary px-2 sm:px-3 py-1 text-xs sm:text-sm font-bold flex items-center gap-1 shrink-0">
              📱 Pass & Play
            </span>
          )}

          {/* Only show Rooms, Notice, Rankings, and Profile on Homepage (Hidden in multiplayer & local rooms) */}
          {!roomState && !isLocalMode && (
            <>
              {/* Public Rooms Modal Button */}
              <button
                onClick={() => {
                  sound.playPop();
                  fetchPublicRooms();
                  setShowPublicRooms(true);
                }}
                title="Public Classroom Rooms"
                className="sketch flex items-center justify-center gap-1 bg-accent text-accent-foreground px-2 sm:px-3 py-1 text-xs sm:text-sm md:text-base font-bold hover:brightness-110 shrink-0"
              >
                <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Rooms</span>
              </button>

              {/* Notice Board Button */}
              <button
                onClick={() => {
                  sound.playPop();
                  setShowNoticeBoard(true);
                }}
                title="Classroom Notice Board"
                className="sketch flex items-center justify-center gap-1 bg-secondary px-2 sm:px-3 py-1 text-xs sm:text-sm md:text-base font-bold hover:bg-secondary/80 shrink-0"
              >
                <Pin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent" />
                <span className="hidden sm:inline">Notice</span>
              </button>

              {/* Leaderboard Button */}
              <button
                onClick={() => {
                  sound.playPop();
                  setShowLeaderboard(true);
                }}
                title="Classroom Rankings"
                className="sketch flex items-center justify-center gap-1 bg-secondary px-2 sm:px-3 py-1 text-xs sm:text-sm md:text-base font-bold hover:bg-secondary/80 shrink-0"
              >
                <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent" />
                <span className="hidden sm:inline">Rankings</span>
              </button>

              {/* Account Profile Button */}
              <button
                onClick={() => {
                  sound.playPop();
                  setShowAccount(true);
                }}
                title={user?.displayName ? `Account: ${user.displayName}` : "Account Profile"}
                className="sketch flex items-center justify-center bg-card px-2 sm:px-2.5 py-1 text-sm sm:text-base font-bold hover:bg-secondary shrink-0"
              >
                <span className="text-sm sm:text-base leading-none select-none" role="img" aria-label="Profile">
                  👤
                </span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* VIEW 1: HOME / LANDING PAGE */}
      {!roomState && !isLocalMode && (
        <section className="notebook relative mx-auto max-w-4xl rounded-sm py-5 sm:py-10 pl-3.5 sm:pl-12 md:pl-20 pr-3 sm:pr-8 md:pr-12 shadow-2xl">
          <div className="tape absolute -top-4 left-1/2 h-7 w-36 -translate-x-1/2 rotate-[-2deg]" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
            {/* Left Hero Details */}
            <div className="md:col-span-8 space-y-4 sm:space-y-6 min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-accent font-bold text-xs sm:text-sm border border-accent/30">
                <span>🕵️ Real-Time Multiplayer Party Game</span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-display leading-[0.95] text-foreground break-words">
                One Word. Different Secrets. <br />
                <span className="marker text-accent">Who's the Imposter?</span>
              </h1>

              <p className="max-w-xl text-base sm:text-lg text-muted-foreground font-hand">
                Everyone gets the same word — except the imposter! Share clues, debate suspects, and vote out the bluffer.
              </p>

              {/* Game Rules / Instructions — Short, Crisp & Punchy */}
              <div className="relative py-1 space-y-2 font-hand text-sm sm:text-base border-l-2 border-primary/30 pl-3 my-2">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xs font-mono shadow-xs">
                    1
                  </span>
                  <span>Peek at your secret word 🔍</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xs font-mono shadow-xs">
                    2
                  </span>
                  <span>Give 1 clue (Text, Draw, Voice) 🎨</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xs font-mono shadow-xs">
                    3
                  </span>
                  <span>Debate suspects in chat 🗣️</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xs font-mono shadow-xs">
                    4
                  </span>
                  <span>Vote & catch the imposter! 🗳️</span>
                </div>
              </div>

              {/* CTA Action Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-4 pt-1 max-w-full">
                <Btn
                  onClick={() => handleCreateRoom({ isPublic: true })}
                  className="w-full sm:w-auto text-center justify-center"
                >
                  Create Room (3-14 Players)
                </Btn>
                <div className="flex items-center gap-2 w-full sm:w-auto max-w-full">
                  <input
                    type="text"
                    value={roomCodeInput}
                    onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                    placeholder="ENTER CODE"
                    maxLength={6}
                    className="sketch flex-1 min-w-0 sm:w-36 bg-white px-2.5 sm:px-3 py-2 text-center text-base sm:text-lg font-bold uppercase tracking-wider focus:outline-none"
                  />
                  <Btn
                    variant="secondary"
                    onClick={() => handleJoinRoom(roomCodeInput)}
                    className="px-4 sm:px-5 py-2.5 shrink-0 justify-center"
                  >
                    Join
                  </Btn>
                </div>
              </div>
            </div>

            {/* Right Hero Illustration (Detective Mascot) */}
            <div className="md:col-span-4 flex flex-col items-center justify-center text-center space-y-3 pt-2 md:pt-0">
              <div className="relative group cursor-pointer">
                <img
                  src="/detective-waving.png"
                  alt="Imposter World Detective"
                  className="max-h-48 sm:max-h-64 md:max-h-72 w-auto object-contain drop-shadow-xl transition-transform group-hover:scale-105"
                />
                <div className="tape absolute -bottom-2 left-1/2 -translate-x-1/2 h-4 sm:h-5 w-20 sm:w-24 rotate-[2deg]" />
              </div>
              <div className="text-[11px] sm:text-xs text-muted-foreground font-hand">
                "Classroom Detective on duty. 100% Anti-Cheat Server."
              </div>
            </div>
          </div>

          {/* PLAY ANOTHER WAY SECTION */}
          <div className="relative mt-8 sm:mt-12 pt-6 sm:pt-8 border-t-2 border-foreground/20 space-y-4 font-hand">
            <img
              src="/paper-plane.svg"
              alt="Paper Airplane"
              className="pointer-events-none absolute -top-6 right-2 sm:right-6 h-14 w-14 sm:h-18 sm:w-18 object-contain opacity-85 rotate-[-8deg] drop-shadow-xs"
            />
            <div className="flex items-center justify-between">
              <h3 className="text-2xl sm:text-3xl font-display text-foreground flex items-center gap-2">
                <Compass className="h-6 w-6 text-accent" /> Play Another Way
              </h3>
              <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider hidden sm:inline">
                CHOOSE YOUR MODE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {/* Card 1: FRIEND */}
              <button
                onClick={() => {
                  sound.playPop();
                  handleCreateRoom({ isPublic: false }); // Private Room for friends
                }}
                className="sketch group bg-white/90 p-4 text-left space-y-2 hover:-translate-y-1 hover:shadow-md transition-all border-2 border-foreground"
              >
                <div className="flex items-center justify-between text-xs font-bold text-primary">
                  <span className="bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                    FRIEND
                  </span>
                  <span className="text-lg group-hover:translate-x-1 transition-transform">›</span>
                </div>
                <div className="text-xl font-display font-bold text-foreground">Play with Friends</div>
                <p className="text-xs text-muted-foreground">
                  2-14 players invite with a private secret link
                </p>
              </button>

              {/* Card 2: TOURNAMENT */}
              <button
                onClick={() => {
                  sound.playPop();
                  setShowNoticeBoard(true);
                }}
                className="sketch group bg-white/90 p-4 text-left space-y-2 hover:-translate-y-1 hover:shadow-md transition-all border-2 border-foreground"
              >
                <div className="flex items-center justify-between text-xs font-bold text-accent">
                  <span className="bg-accent text-accent-foreground px-1.5 py-0.5 rounded font-bold">
                    NEW
                  </span>
                  <span className="text-lg group-hover:translate-x-1 transition-transform">›</span>
                </div>
                <div className="text-xl font-display font-bold text-foreground">Tournament</div>
                <p className="text-xs text-muted-foreground">
                  Next one today (wed) • <strong>{championName} holds the belt</strong>
                </p>
              </button>

              {/* Card 3: LOCAL (Pass-and-play on 1 phone) */}
              <button
                onClick={() => {
                  sound.playPop();
                  setIsLocalMode(true);
                }}
                className="sketch group bg-white/90 p-4 text-left space-y-2 hover:-translate-y-1 hover:shadow-md transition-all border-2 border-foreground"
              >
                <div className="flex items-center justify-between text-xs font-bold text-foreground">
                  <span className="bg-highlight px-2 py-0.5 rounded font-bold border border-foreground/30">
                    SAVED
                  </span>
                  <span className="text-lg group-hover:translate-x-1 transition-transform">›</span>
                </div>
                <div className="text-xl font-display font-bold text-foreground">Local Pass & Play</div>
                <p className="text-xs text-muted-foreground">
                  2-10 players on 1 phone • score 1-1
                </p>
              </button>

              {/* Card 4: INSTANT */}
              <button
                onClick={handleInstantMatch}
                className="sketch group bg-accent text-accent-foreground p-4 text-left space-y-2 hover:-translate-y-1 hover:shadow-md transition-all border-2 border-foreground"
              >
                <div className="flex items-center justify-between text-xs font-bold opacity-95">
                  <span className="bg-white/20 px-2 py-0.5 rounded font-bold">INSTANT</span>
                  <span className="text-lg group-hover:translate-x-1 transition-transform">›</span>
                </div>
                <div className="text-xl font-display font-bold text-accent-foreground">Instant Match</div>
                <p className="text-xs opacity-90">
                  Find someone online and jump into class!
                </p>
              </button>
            </div>
          </div>

          {/* NOTEBOOK CLASSROOM FOOTER */}
          <footer className="mt-12 text-center space-y-1.5 font-hand border-t border-foreground/15 pt-5">
            <div className="text-xs sm:text-sm text-foreground/75 flex items-center justify-center gap-1">
              <span>made on the last bench by <span className="underline decoration-foreground/40 font-bold">adi</span></span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-xs sm:text-sm text-primary font-bold">
              <Link to="/how-to-play" className="underline hover:text-accent">
                How To Play Imposter World
              </Link>
              <span className="text-muted-foreground/60">·</span>
              <Link to="/how-to-play" className="underline hover:text-accent">
                What Is Imposter World?
              </Link>
              <span className="text-muted-foreground/60">·</span>
              <Link to="/notice-board" className="underline hover:text-accent">
                Notice Board
              </Link>
              <span className="text-muted-foreground/60">·</span>
              <Link to="/support" className="underline hover:text-accent">
                Support the Dev
              </Link>
            </div>
          </footer>
        </section>
      )}

      {/* VIEW: LOCAL PASS-AND-PLAY ON 1 DEVICE */}
      {isLocalMode && (
        <section className="notebook relative mx-auto max-w-2xl rounded-sm py-6 sm:py-8 pl-3.5 sm:pl-12 md:pl-20 pr-3 sm:pr-8 md:pr-10 shadow-2xl space-y-4 sm:space-y-6">
          <div className="tape absolute -top-4 left-1/2 h-7 w-36 -translate-x-1/2 rotate-[-1deg]" />

          <div className="flex items-center justify-between gap-2 border-b-2 border-foreground/30 pb-3">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <img
                src="/secret-folder.svg"
                alt="Secret Folder"
                className="h-8 w-8 sm:h-12 sm:w-12 object-contain shrink-0 drop-shadow-xs"
              />
              <div className="min-w-0">
                <span className="text-[10px] sm:text-xs font-bold text-accent font-hand uppercase block truncate">Single Device Mode</span>
                <h2 className="text-xl sm:text-3xl font-display text-foreground truncate">Local Pass & Play 📱</h2>
              </div>
            </div>
            <button
              onClick={() => {
                sound.playPop();
                setIsLocalMode(false);
              }}
              className="sketch bg-secondary px-2.5 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-bold text-foreground shrink-0"
            >
              Exit Local
            </button>
          </div>

          {localPhase === "lobby" && (
            <div className="space-y-4 font-hand">
              <div className="text-sm text-muted-foreground">
                Pass this single phone/laptop around your group. Each player views their secret word in private!
              </div>

              {/* Player list tags with removal option for all */}
              <div className="flex flex-wrap gap-2">
                {localPlayers.map((name, i) => (
                  <span
                    key={`${name}-${i}`}
                    className="sketch bg-white px-2.5 sm:px-3 py-1 font-bold text-sm sm:text-base flex items-center gap-1.5 sm:gap-2 shadow-2xs"
                  >
                    <span className="truncate max-w-[120px]">{name}</span>
                    <button
                      type="button"
                      onClick={() => setLocalPlayers(localPlayers.filter((_, idx) => idx !== i))}
                      className="text-xs text-destructive hover:bg-destructive/15 rounded-full h-5 w-5 inline-flex items-center justify-center font-bold transition-colors cursor-pointer shrink-0"
                      title={`Remove ${name}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* Add player input */}
              {localPlayers.length < 12 && (
                <div className="flex flex-col sm:flex-row gap-2 w-full max-w-full">
                  <input
                    type="text"
                    value={localNewPlayerName}
                    onChange={(e) => setLocalNewPlayerName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && localNewPlayerName.trim()) {
                        setLocalPlayers([...localPlayers, localNewPlayerName.trim()]);
                        setLocalNewPlayerName("");
                      }
                    }}
                    placeholder="New player name..."
                    className="sketch flex-1 min-w-0 w-full bg-white px-3 py-2 text-base focus:outline-none"
                    maxLength={15}
                  />
                  <Btn
                    variant="secondary"
                    className="w-full sm:w-auto shrink-0 justify-center"
                    onClick={() => {
                      if (localNewPlayerName.trim()) {
                        setLocalPlayers([...localPlayers, localNewPlayerName.trim()]);
                        setLocalNewPlayerName("");
                      }
                    }}
                  >
                    Add Player +
                  </Btn>
                </div>
              )}

              <div className="pt-4 border-t border-line space-y-2">
                {localPlayers.length < 3 && (
                  <div className="text-xs text-amber-800 bg-amber-50 p-2 rounded border border-amber-300 font-bold">
                    ⚠️ Add at least 3 players to start (currently {localPlayers.length}/3)
                  </div>
                )}
                <Btn className="w-full sm:w-auto justify-center" onClick={startLocalGame} disabled={localPlayers.length < 3}>
                  Start Pass & Play Round 🚀
                </Btn>
              </div>
            </div>
          )}

          {localPhase === "reveal" && localRound && (
            <div className="text-center space-y-6 font-hand py-6">
              <div className="text-xs font-bold text-muted-foreground uppercase">
                PLAYER {localTurn + 1} OF {localPlayers.length}
              </div>
              <h3 className="text-4xl font-display text-foreground">
                Pass phone to: <span className="text-accent underline">{localPlayers[localTurn]}</span>
              </h3>

              {!localWordRevealed ? (
                /* Hidden state: Detective has eyes covered with hands! */
                <div className="sketch max-w-sm mx-auto bg-card p-6 border-2 border-foreground space-y-4 shadow-sm">
                  <div className="relative mx-auto flex items-center justify-center">
                    <img
                      src="/detective-covering-eyes.png"
                      alt="Detective Covering Eyes"
                      className="h-32 sm:h-36 w-auto object-contain drop-shadow-md transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-display text-foreground">
                      Only <span className="text-accent underline font-bold">{localPlayers[localTurn]}</span> should look!
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Detective has his eyes covered tight with both hands! Tap below to open eyes.
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      setLocalWordRevealed(true);
                    }}
                    className="sketch w-full flex items-center justify-center gap-2 bg-accent py-3 text-lg font-bold text-accent-foreground hover:brightness-110 shadow-sm animate-pulse"
                  >
                    <Eye className="h-5 w-5" /> Open Eyes & Reveal Secret Word 👁️
                  </button>
                </div>
              ) : (
                /* Revealed state: Detective has eyes wide open! */
                <div className="sketch max-w-sm mx-auto bg-white p-6 border-2 border-accent space-y-4 shadow-md">
                  <div className="relative mx-auto flex items-center justify-center">
                    <img
                      src="/detective-eyes-open.png"
                      alt="Detective Eyes Wide Open"
                      className="h-32 sm:h-36 w-auto object-contain drop-shadow-md transition-transform scale-105"
                    />
                  </div>
                  {localRound.category && (
                    <div className="inline-block bg-highlight px-3 py-1 rounded text-xs font-bold border border-foreground/30">
                      📁 Category: {localRound.category}
                    </div>
                  )}
                  <span className="text-xs text-muted-foreground block font-bold tracking-wider uppercase">
                    CONFIDENTIAL SECRET WORD
                  </span>
                  <div className="text-4xl font-display text-accent font-bold">
                    {localTurn === localRound.imposterIdx ? localRound.fake : localRound.word}
                  </div>
                  <div className="text-xs font-bold text-muted-foreground">
                    {localTurn === localRound.imposterIdx
                      ? "🕵️ You are the Imposter! (Blend in and pretend you know the common word)"
                      : "🔎 You are a Detective! (Spot the player whose clue sounds off)"}
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playPop();
                        setLocalWordRevealed(false);
                        if (localTurn + 1 < localPlayers.length) {
                          setLocalTurn(localTurn + 1);
                        } else {
                          setLocalPhase("discuss");
                        }
                      }}
                      className="sketch w-full flex items-center justify-center gap-2 bg-primary py-2.5 text-base font-bold text-primary-foreground hover:brightness-110 shadow-sm"
                    >
                      <EyeOff className="h-4 w-4" />
                      {localTurn + 1 < localPlayers.length
                        ? `Cover Eyes & Pass to ${localPlayers[localTurn + 1]} 🔒`
                        : "Cover Eyes & Start Discussion! 🗣️"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {localPhase === "discuss" && localRound && (
            <div className="space-y-6 text-center font-hand py-4">
              <h3 className="text-3xl sm:text-4xl font-display text-foreground">Classroom Discussion! 🗣️</h3>
              <p className="text-base text-muted-foreground max-w-md mx-auto">
                Each player speaks 1 clue out loud around the circle. Debate suspicious hints before casting your votes!
              </p>

              <div className="sketch bg-highlight/30 p-4 border border-foreground/30 max-w-sm mx-auto space-y-1">
                <span className="text-xs font-bold text-muted-foreground block uppercase">Finished Debate?</span>
                <div className="text-sm">Proceed to interrogate and vote on who the imposter is!</div>
              </div>

              <Btn
                onClick={() => {
                  sound.playDing();
                  setLocalVotes({});
                  setLocalPhase("vote");
                }}
              >
                Proceed to Vote 🗳️
              </Btn>
            </div>
          )}

          {localPhase === "vote" && localRound && (
            <div className="space-y-5 text-center font-hand py-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-accent uppercase font-mono">Phase 3: Interrogation</span>
                <h3 className="text-3xl sm:text-4xl font-display text-foreground">Cast Classroom Votes! 🗳️</h3>
                <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
                  Every player in the circle gets <strong>1 vote</strong>. Tap <strong className="text-accent">+ Vote</strong> on the player you suspect!
                </p>
              </div>

              {/* Vote Budget Indicator */}
              {(() => {
                const totalVotes = Object.values(localVotes).reduce((a, b) => a + b, 0);
                const maxVotesAllowed = localPlayers.length;
                const votesRemaining = Math.max(0, maxVotesAllowed - totalVotes);

                return (
                  <div className="flex items-center justify-center gap-3">
                    <div className="sketch inline-flex items-center gap-2 bg-white px-3.5 py-1.5 border border-foreground/30 shadow-xs">
                      <span className="text-xs font-mono font-bold text-muted-foreground uppercase">Classroom Votes:</span>
                      <span className="font-display text-lg font-bold text-accent">
                        {totalVotes} / {maxVotesAllowed}
                      </span>
                      {votesRemaining === 0 ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[11px] px-2 py-0.5 rounded font-bold">
                          ✅ All Voted
                        </span>
                      ) : (
                        <span className="text-xs text-amber-800 font-bold">
                          ({votesRemaining} {votesRemaining === 1 ? "vote" : "votes"} left)
                        </span>
                      )}
                    </div>
                    {totalVotes > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          sound.playPop();
                          setLocalVotes({});
                        }}
                        className="text-xs text-muted-foreground hover:text-destructive underline font-bold cursor-pointer"
                      >
                        Reset 🔄
                      </button>
                    )}
                  </div>
                );
              })()}

              {/* Voting Cards Grid */}
              {(() => {
                const totalVotes = Object.values(localVotes).reduce((a, b) => a + b, 0);
                const maxVotesAllowed = localPlayers.length;

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-xl mx-auto">
                    {localPlayers.map((player) => {
                      const voteCount = localVotes[player] || 0;
                      return (
                        <div
                          key={player}
                          className={`sketch p-3 text-center transition-all ${
                            voteCount > 0
                              ? "bg-amber-100/90 border-2 border-accent shadow-sm"
                              : "bg-white/80 border border-foreground/30"
                          }`}
                        >
                          <div className="font-display text-lg font-bold text-foreground truncate">
                            {player}
                          </div>
                          <div className="text-xs font-bold my-1">
                            {voteCount > 0 ? (
                              <span className="inline-block bg-accent text-accent-foreground px-2 py-0.5 rounded-full text-xs font-mono">
                                🗳️ {voteCount} {voteCount === 1 ? "Vote" : "Votes"}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">0 votes</span>
                            )}
                          </div>
                          <div className="flex items-center justify-center gap-1.5 pt-1">
                            <button
                              type="button"
                              disabled={totalVotes >= maxVotesAllowed}
                              onClick={() => {
                                if (totalVotes >= maxVotesAllowed) return;
                                sound.playPop();
                                setLocalVotes((prev) => ({
                                  ...prev,
                                  [player]: (prev[player] || 0) + 1,
                                }));
                              }}
                              className="sketch bg-accent text-accent-foreground px-2.5 py-1 text-xs font-bold hover:brightness-105 active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
                              title={totalVotes >= maxVotesAllowed ? "All votes have been cast!" : "+1 Vote"}
                            >
                              + Vote
                            </button>
                            {voteCount > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  sound.playPop();
                                  setLocalVotes((prev) => ({
                                    ...prev,
                                    [player]: Math.max(0, (prev[player] || 0) - 1),
                                  }));
                                }}
                                className="sketch bg-secondary text-foreground px-2 py-1 text-xs font-bold hover:bg-secondary/80 cursor-pointer"
                                title="-1 Vote"
                              >
                                -
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              {/* Tally Summary & Actions */}
              {(() => {
                const totalVotes = Object.values(localVotes).reduce((a, b) => a + b, 0);
                const maxVotesAllowed = localPlayers.length;
                const sortedSuspects = Object.entries(localVotes).sort((a, b) => b[1] - a[1]);
                const topSuspect = sortedSuspects[0];
                const allVoted = totalVotes >= maxVotesAllowed;

                return (
                  <div className="space-y-3 max-w-sm mx-auto">
                    <div className="sketch bg-highlight/40 p-2.5 border border-foreground/30 text-xs sm:text-sm">
                      {allVoted && topSuspect && topSuspect[1] > 0 ? (
                        <span>
                          🎯 All {maxVotesAllowed} votes are in! Prime Suspect: <strong className="text-accent underline font-display text-base">{topSuspect[0]}</strong> ({topSuspect[1]} votes)
                        </span>
                      ) : totalVotes > 0 && topSuspect && topSuspect[1] > 0 ? (
                        <span>
                          🎯 Leading Suspect: <strong className="text-accent underline font-display text-base">{topSuspect[0]}</strong> with {topSuspect[1]} votes ({totalVotes}/{maxVotesAllowed} cast)
                        </span>
                      ) : (
                        <span>Each player taps <strong>+ Vote</strong> once for their main suspect!</span>
                      )}
                    </div>

                    <div className="flex justify-center gap-2 pt-1">
                      <Btn
                        variant="secondary"
                        onClick={() => setLocalPhase("discuss")}
                      >
                        Back to Discuss
                      </Btn>
                      <Btn
                        onClick={() => {
                          sound.playVictory();
                          setLocalPhase("result");
                        }}
                      >
                        Reveal the Imposter 🕵️
                      </Btn>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {localPhase === "result" && localRound && (
            <div className="text-center space-y-5 font-hand py-4">
              {(() => {
                const actualImposter = localPlayers[localRound.imposterIdx];
                const sortedSuspects = Object.entries(localVotes).sort((a, b) => b[1] - a[1]);
                const topSuspect = sortedSuspects[0];
                const caughtImposter = Boolean(topSuspect && topSuspect[1] > 0 && topSuspect[0] === actualImposter);

                return (
                  <>
                    <div className="flex items-center justify-center gap-4">
                      <img
                        src="/trophy-gold.png"
                        alt="Trophy"
                        className="h-20 w-20 object-contain drop-shadow-md animate-bounce"
                      />
                      <img
                        src="/detective-jumping-win.png"
                        alt="Detective Jumping Celebration"
                        className="h-24 w-auto object-contain drop-shadow-md"
                      />
                    </div>

                    <div className={`p-3 rounded-lg border-2 max-w-md mx-auto ${
                      caughtImposter
                        ? "bg-emerald-50 border-emerald-500 text-emerald-950"
                        : "bg-rose-50 border-rose-400 text-rose-950"
                    }`}>
                      <div className="text-2xl sm:text-3xl font-display font-bold">
                        {caughtImposter
                          ? "🎉 BUSTED! Classroom Caught the Imposter!"
                          : "🤫 ESCAPED! The Imposter Fooled Everyone!"}
                      </div>
                      <p className="text-xs sm:text-sm font-hand mt-1">
                        {caughtImposter
                          ? `Great deduction! ${actualImposter} was correctly voted out.`
                          : `${actualImposter} was the real imposter and fooled the class!`}
                      </p>
                    </div>

                    <div className="text-3xl font-display text-accent font-bold">
                      The Real Imposter was: <span className="underline">{actualImposter}</span>!
                    </div>

                    {/* Classroom Vote Tally */}
                    {Object.keys(localVotes).length > 0 && (
                      <div className="sketch bg-white/70 p-3 max-w-sm mx-auto border border-foreground/20 text-xs">
                        <div className="font-bold text-muted-foreground uppercase mb-1">Classroom Vote Tally:</div>
                        <div className="flex flex-wrap justify-center gap-2">
                          {localPlayers.map((p) => (
                            <span key={p} className="sketch bg-white px-2 py-0.5 text-xs font-mono">
                              {p}: {localVotes[p] || 0} votes
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}

              {localRound.category && (
                <div className="inline-block bg-highlight px-3 py-1 rounded text-sm font-bold border border-foreground/30">
                  📁 Category: {localRound.category}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                <div className="sketch bg-white p-3">
                  <span className="text-xs text-muted-foreground block font-bold">COMMON WORD</span>
                  <span className="text-2xl font-display text-primary font-bold">{localRound.word}</span>
                </div>
                <div className="sketch bg-white p-3">
                  <span className="text-xs text-muted-foreground block font-bold">IMPOSTER WORD</span>
                  <span className="text-2xl font-display text-accent font-bold">{localRound.fake}</span>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <Btn onClick={startLocalGame}>Next Round 🚀</Btn>
                <Btn variant="secondary" onClick={() => setLocalPhase("lobby")}>
                  Back to Setup
                </Btn>
              </div>
            </div>
          )}
        </section>
      )}

      {/* VIEW 2: LOBBY / ROOM WAITING AREA */}
      {roomState && roomState.phase === "lobby" && (
        <section className="notebook relative mx-auto max-w-4xl rounded-sm py-6 sm:py-10 pl-5 sm:pl-12 md:pl-20 pr-4 sm:pr-8 md:pr-12 shadow-2xl space-y-4 sm:space-y-6">
          <div className="tape absolute -top-4 left-1/2 h-7 w-36 -translate-x-1/2 rotate-[-1deg]" />

          {/* Room Header Info */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-foreground/30 pb-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded uppercase font-hand ${
                    roomState.settings.isPublic
                      ? "bg-accent/20 text-accent border border-accent/30"
                      : "bg-primary/20 text-primary border border-primary/30"
                  }`}
                >
                  {roomState.settings.isPublic ? "🟢 Public Room" : "🔒 Private Room"}
                </span>
                <span className="text-sm font-bold text-accent font-hand uppercase">Classroom Lobby</span>
                {lobbyTimeLeft !== null && (
                  <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded uppercase font-hand bg-amber-100 text-amber-900 border border-amber-400/60 shadow-xs">
                    <Clock className="h-3.5 w-3.5 animate-pulse text-amber-700" />
                    Auto-closes in {Math.floor(lobbyTimeLeft / 60)}:{(lobbyTimeLeft % 60).toString().padStart(2, "0")}
                  </span>
                )}
              </div>
              <h2 className="text-4xl md:text-5xl font-display text-foreground">
                Room #{roomState.roomCode}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleCopyLink}
                className="sketch flex items-center gap-1.5 bg-secondary px-4 py-2 font-bold text-base hover:bg-secondary/80"
              >
                {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copiedLink ? "Link Copied!" : "Copy Invite Link"}
              </button>

              <button
                onClick={() => {
                  sound.playPop();
                  setShowSettings(true);
                }}
                className="sketch flex items-center gap-1.5 bg-card px-4 py-2 font-bold text-base hover:bg-secondary"
              >
                <Settings className="h-4 w-4 text-accent" />
                Settings
              </button>

              <button
                onClick={handleLeaveRoom}
                className="sketch bg-secondary px-4 py-2 font-bold text-base text-destructive hover:bg-destructive/10"
              >
                Leave
              </button>
            </div>
          </div>

          {/* Game Settings Summary Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-hand text-center">
            <div className="sketch bg-white/70 p-2.5 rounded">
              <span className="text-xs text-muted-foreground block font-bold">CAPACITY</span>
              <span className="text-xl font-bold font-display text-primary">
                {roomState.players.length} / {roomState.settings.capacity}
              </span>
            </div>
            <div className="sketch bg-white/70 p-2.5 rounded">
              <span className="text-xs text-muted-foreground block font-bold">HINT / DRAW TIME</span>
              <span className="text-xl font-bold font-display text-accent">
                {roomState.settings.drawTime}s
              </span>
            </div>
            <div className="sketch bg-white/70 p-2.5 rounded">
              <span className="text-xs text-muted-foreground block font-bold">ROUNDS</span>
              <span className="text-xl font-bold font-display text-foreground">
                {roomState.settings.rounds}
              </span>
            </div>
            <div className="sketch bg-white/70 p-2.5 rounded">
              <span className="text-xs text-muted-foreground block font-bold">MODE</span>
              <span className="text-lg font-bold font-display text-foreground capitalize">
                {roomState.settings.gameMode.replace("_", " ")}
              </span>
            </div>
          </div>

          {/* Classroom Welcome Banner with Waving Detective */}
          <div className="sketch bg-white/80 p-3 sm:p-4 flex items-center gap-3 sm:gap-4 border-2 border-foreground shadow-xs">
            <img
              src="/detective-waving.png"
              alt="Detective Waving"
              className="h-16 w-16 sm:h-20 sm:w-20 object-contain shrink-0 drop-shadow-xs"
            />
            <div className="font-hand space-y-0.5">
              <h4 className="text-xl sm:text-2xl font-display text-primary font-bold">
                Welcome to Class! 👋
              </h4>
              <p className="text-xs sm:text-sm text-foreground">
                {roomState.players.length < 3
                  ? "Share room code or invite link with friends. Match can start once 3 detectives arrive!"
                  : "All desks are ready! Host can start the round anytime."}
              </p>
            </div>
          </div>

          {/* Player Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between font-hand">
              <h3 className="text-2xl font-display text-foreground flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" /> Who's in Class? ({roomState.players.length})
              </h3>
              {roomState.players.length < 3 && (
                <span className="text-sm font-bold text-destructive">
                  ⚠️ Need at least 3 players to start
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {roomState.players.map((p: any) => (
                <div
                  key={p.socketId}
                  className="sketch bg-white/90 p-3 flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-secondary border border-foreground/30 flex items-center justify-center font-bold text-primary font-display text-lg">
                      {p.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="truncate">
                      <div className="font-bold text-base truncate flex items-center gap-1.5 flex-wrap">
                        {p.displayName}
                        {p.isHost && (
                          <span className="rounded bg-accent/20 px-1 text-[11px] font-bold text-accent border border-accent/30">
                            HOST
                          </span>
                        )}
                        {p.userId?.startsWith("guest_") && (
                          <span className="rounded bg-muted px-1 text-[10px] font-bold text-muted-foreground border border-foreground/20">
                            GUEST
                          </span>
                        )}
                        {p.socketId === currentSocketId && (
                          <span className="text-xs text-muted-foreground font-normal">(You)</span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">Ready to play ✏️</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lobby Start Action */}
          <div className="pt-4 border-t-2 border-foreground/30 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-muted-foreground font-hand">
              {isHost
                ? "You are the host. Configure settings above and start when ready."
                : "Waiting for the host to start the match..."}
            </div>

            {isHost && (
              <Btn
                disabled={roomState.players.length < 3}
                onClick={handleStartGame}
                className="w-full sm:w-auto"
              >
                Start Game 🚀 ({roomState.players.length}/3 Min)
              </Btn>
            )}
          </div>
        </section>
      )}

      {/* VIEW 3: IN-GAME MULTIPLAYER PLAYING AREA */}
      {roomState && roomState.phase !== "lobby" && (
        <section className="notebook relative mx-auto max-w-5xl rounded-sm py-6 sm:py-8 pl-5 sm:pl-12 md:pl-20 pr-4 sm:pr-8 md:pr-12 shadow-2xl space-y-4 sm:space-y-6">
          <div className="tape absolute -top-4 left-1/2 h-7 w-36 -translate-x-1/2 rotate-[-1deg]" />

          {/* Game Round & Phase Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-foreground/30 pb-3 font-hand">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="sketch bg-secondary px-2.5 sm:px-3 py-1 text-sm sm:text-base font-bold text-foreground">
                Round {roomState.currentRound} of {roomState.totalRounds}
              </span>

              <span className="sketch bg-highlight px-2.5 sm:px-3 py-1 text-sm sm:text-base font-bold text-foreground capitalize">
                {roomState.phase === "hint_turn" && "Clue Phase"}
                {roomState.phase === "discussion" && (
                  <span>
                    Discussion ({remainingTime}s)
                    {roomState.skipDiscussionVotesCount > 0 && ` • ${roomState.skipDiscussionVotesCount}/${roomState.skipDiscussionRequired} Skip`}
                  </span>
                )}
                {roomState.phase === "answer_submission" && "Secret Vote"}
                {roomState.phase === "results" && "Round Results"}
              </span>
            </div>

            {/* Authoritative Server Countdown */}
            {remainingTime > 0 && roomState.phase !== "results" && (
              <div className="sketch bg-accent px-3 sm:px-4 py-1 text-accent-foreground font-bold text-base sm:text-lg flex items-center gap-1.5 sm:gap-2">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 animate-pulse" />
                <span>{remainingTime}s</span>
              </div>
            )}
          </div>

          {/* PRIVATE SECRET WORD BAR (Compact & Clean Desk Strip) */}
          {secretInfo && (
            <div className="sketch bg-white/95 px-3.5 py-2 sm:px-4 sm:py-2.5 flex items-center justify-between gap-3 border-2 border-foreground shadow-xs font-hand">
              <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                <img
                  src={showSecretWord ? "/detective-eyes-open.png" : "/detective-covering-eyes.png"}
                  alt="Detective Mascot"
                  className="h-9 w-9 sm:h-11 sm:w-11 object-contain shrink-0 drop-shadow-xs"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <span className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase font-mono tracking-wider">
                      {showSecretWord ? "YOUR WORD:" : "SECRET WORD:"}
                    </span>
                    {showSecretWord && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                        secretInfo.role === "imposter"
                          ? "bg-accent/20 text-accent border border-accent/30"
                          : "bg-primary/20 text-primary border border-primary/30"
                      }`}>
                        {secretInfo.role === "imposter" ? "🕵️ IMPOSTER" : "🔎 DETECTIVE"}
                      </span>
                    )}
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-display text-accent font-bold truncate leading-tight">
                    {showSecretWord ? secretInfo.word : "🔒 • • • • • • 🔒"}
                  </div>
                </div>
              </div>

              <div className="shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    setShowSecretWord(!showSecretWord);
                  }}
                  className={`sketch flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold transition-all shadow-xs ${
                    showSecretWord
                      ? "bg-secondary text-foreground hover:bg-secondary/80"
                      : "bg-accent text-accent-foreground hover:brightness-110"
                  }`}
                >
                  {showSecretWord ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  <span>{showSecretWord ? "Hide 🔒" : "Peek 👁️"}</span>
                </button>
              </div>
            </div>
          )}

          {/* MAIN GAME PHASE PANELS (Draw & Guess Studio Layout) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left 7 Columns: Clue Canvas / Composer & Pinboard */}
            <div className="lg:col-span-7 space-y-5">
              {roomState.phase === "hint_turn" && (
                <div>
                  {isMyTurn ? (
                    <div className="sketch bg-white/95 p-3 sm:p-4 border-2 border-accent space-y-3 shadow-sm">
                      {/* Studio Top Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-foreground/15 pb-2.5">
                        <div className="font-bold text-accent flex items-center gap-1.5 font-display text-lg sm:text-xl">
                          <Flame className="h-4 w-4 sm:h-5 sm:w-5 text-accent animate-pulse" />
                          <span>Your Turn to Give a Clue!</span>
                        </div>

                        {/* Clue Mode Tabs */}
                        <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded border border-foreground/20 font-hand">
                          <button
                            type="button"
                            onClick={() => {
                              sound.playPop();
                              setClueType("text");
                            }}
                            className={`sketch px-2.5 py-1 text-xs font-bold transition-all ${
                              clueType === "text"
                                ? "bg-accent text-accent-foreground shadow-xs"
                                : "bg-transparent text-foreground hover:bg-secondary"
                            }`}
                          >
                            ✏️ Text
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              sound.playPop();
                              setClueType("draw");
                            }}
                            className={`sketch px-2.5 py-1 text-xs font-bold transition-all ${
                              clueType === "draw"
                                ? "bg-accent text-accent-foreground shadow-xs"
                                : "bg-transparent text-foreground hover:bg-secondary"
                            }`}
                          >
                            🎨 Sketch
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              sound.playPop();
                              setClueType("voice");
                            }}
                            className={`sketch px-2.5 py-1 text-xs font-bold transition-all ${
                              clueType === "voice"
                                ? "bg-accent text-accent-foreground shadow-xs"
                                : "bg-transparent text-foreground hover:bg-secondary"
                            }`}
                          >
                            🎙️ Voice
                          </button>
                        </div>
                      </div>

                      {clueType === "text" ? (
                        <div className="space-y-3 font-hand pt-1">
                          <input
                            type="text"
                            value={textClueInput}
                            onChange={(e) => setTextClueInput(e.target.value)}
                            placeholder="Type a clever subtle clue without saying the secret word..."
                            className="sketch w-full bg-card px-3.5 py-2 text-sm sm:text-base focus:outline-none"
                            maxLength={100}
                          />
                          <div className="flex justify-end">
                            <Btn onClick={handleSubmitTextClue} disabled={!textClueInput.trim()}>
                              Submit Clue ✏️
                            </Btn>
                          </div>
                        </div>
                      ) : clueType === "draw" ? (
                        <DrawPad
                          onDone={handleSubmitDrawingClue}
                          onCancel={() => setClueType("text")}
                        />
                      ) : (
                        <VoiceClueRecorder
                          onSubmit={(audioUrl, transcript) => {
                            handleSubmitVoiceClue(audioUrl, transcript);
                          }}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="sketch bg-white/90 p-5 sm:p-6 text-center space-y-2.5 font-hand flex flex-col items-center justify-center border-2 border-foreground/30 shadow-xs">
                      <img
                        src="/detective-drawing.png"
                        alt="Detective Drawing"
                        className="h-20 sm:h-24 w-auto object-contain drop-shadow-xs animate-pulse"
                      />
                      <div className="text-xl sm:text-2xl font-display text-foreground">
                        Waiting for {roomState.activePlayerName}'s clue... ✏️
                      </div>
                      <p className="text-muted-foreground text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
                        Watch closely or inspect their drawing to determine if their clue fits the secret word!
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Discussion Interrogation Card with Majority Skip Option */}
              {roomState.phase === "discussion" && (
                <div className="sketch bg-white/95 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-2 border-primary shadow-xs font-hand">
                  <div className="flex items-center gap-3">
                    <img
                      src="/detective-magnifier.png"
                      alt="Detective Investigating Clues"
                      className="h-12 w-auto object-contain shrink-0 drop-shadow-xs"
                    />
                    <div className="space-y-0.5">
                      <div className="font-bold text-base sm:text-lg font-display text-primary flex items-center gap-2">
                        <span>Classroom Debate & Discussion! 🗣️</span>
                      </div>
                      <p className="text-xs sm:text-sm text-foreground/90">
                        Debate clues in chat, or vote to skip to start secret voting immediately!
                      </p>
                    </div>
                  </div>

                  {/* Skip Discussion Action Button (Majority Rule) */}
                  <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={handleVoteSkipDiscussion}
                      disabled={hasVotedSkipDiscussion}
                      className={`sketch flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-bold transition-all shadow-xs ${
                        hasVotedSkipDiscussion
                          ? "bg-secondary text-foreground/60 border-foreground/30 cursor-not-allowed"
                          : "bg-accent text-accent-foreground hover:brightness-110 animate-pulse"
                      }`}
                      title={
                        hasVotedSkipDiscussion
                          ? "You have already voted to skip discussion."
                          : "Vote to skip discussion (requires majority of players)"
                      }
                    >
                      <span>{hasVotedSkipDiscussion ? "✓ Voted to Skip" : "⏭️ Skip Discussion"}</span>
                      <span className="bg-black/15 text-[11px] px-2 py-0.5 rounded-full font-mono font-bold">
                        {roomState.skipDiscussionVotesCount || 0}/
                        {roomState.skipDiscussionRequired || Math.floor((roomState.players?.filter((p: any) => p.isConnected).length || 3) / 2) + 1}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Pinboard: List of All Clues Given This Round */}
              <div className="space-y-3 font-hand">
                <h4 className="text-2xl font-display text-foreground flex items-center gap-2">
                  <span>📌 Clue Pinboard ({roomState.hints?.length || 0})</span>
                </h4>

                {(!roomState.hints || roomState.hints.length === 0) ? (
                  <div className="sketch bg-card/40 p-6 text-center text-muted-foreground text-sm">
                    No clues shared yet. The first clue will appear here! 📋
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {roomState.hints.map((hint: any, idx: number) => (
                      <div
                        key={idx}
                        className="sketch relative bg-white/95 p-3.5 space-y-2 border border-foreground/30 shadow-xs"
                      >
                        <div className="tape absolute -top-2 left-4 h-4 w-16 rotate-[-2deg]" />
                        <div className="text-xs font-bold text-primary pt-1">{hint.playerName}</div>

                        {hint.type === "text" ? (
                          <div className="text-lg font-bold text-foreground italic">
                            "{hint.content}"
                          </div>
                        ) : hint.type === "voice" ? (
                          <VoiceCluePlayer
                            audioUrl={hint.content}
                            transcript={hint.transcript}
                          />
                        ) : (
                          <div className="rounded border bg-white p-1">
                            <img
                              src={hint.content}
                              alt="Player sketch"
                              className="h-32 w-full object-contain"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* RESULTS BANNER & WORDS REVEAL */}
              {roomState.phase === "results" && roomState.lastResult && (
                <div className="sketch relative bg-highlight/40 p-6 border-2 border-accent space-y-4 text-center font-hand overflow-hidden">
                  <div className="flex items-center justify-center gap-3">
                    <img
                      src="/trophy-gold.png"
                      alt="Trophy"
                      className="h-20 sm:h-24 w-auto object-contain drop-shadow-md hover:scale-110 transition-transform"
                    />
                    <img
                      src="/detective-jumping-win.png"
                      alt="Detective Celebrating Win"
                      className="h-24 sm:h-28 w-auto object-contain drop-shadow-md hover:scale-110 transition-transform animate-bounce"
                    />
                  </div>

                  <div className="text-3xl md:text-4xl font-display font-bold text-accent">
                    {roomState.lastResult.banner}
                  </div>

                  <div className="grid grid-cols-2 gap-3 max-w-md mx-auto pt-2">
                    <div className="sketch bg-white p-3">
                      <span className="text-xs text-muted-foreground block font-bold">COMMON WORD</span>
                      <span className="text-2xl font-display text-primary font-bold">
                        {roomState.lastResult.commonWord}
                      </span>
                    </div>

                    <div className="sketch bg-white p-3">
                      <span className="text-xs text-muted-foreground block font-bold">IMPOSTER WORD</span>
                      <span className="text-2xl font-display text-accent font-bold">
                        {roomState.lastResult.imposterWord}
                      </span>
                    </div>
                  </div>

                  <div className="text-sm font-bold text-foreground">
                    Imposter: {roomState.lastResult.imposterNames?.join(", ") || "Unknown"} 🕵️
                  </div>

                  {isHost && (
                    <div className="pt-2">
                      <Btn onClick={handleNextRound}>
                        {roomState.currentRound >= roomState.totalRounds
                          ? "Finish Match & View Rankings 🏆"
                          : "Start Next Round 🚀"}
                      </Btn>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right 5 Columns: Discussion Chat & Secret Skribbl Answer Panel */}
            <div className="lg:col-span-5">
              <ChatPanel
                messages={roomState.chatMessages || []}
                onSendMessage={handleSendChatMessage}
                phase={roomState.phase}
                players={roomState.players || []}
                currentSocketId={currentSocketId}
                hasSubmittedAnswer={hasSubmittedAnswer}
                onSubmitAnswer={handleSubmitSecretAnswer}
                submissionCount={roomState.answerSubmissionCount || 0}
                totalEligible={roomState.totalEligibleAnswers || roomState.players?.length || 0}
              />
            </div>
          </div>
        </section>
      )}

      {/* MODALS */}
      {showSettings && (
        <RoomSettingsModal
          initialSettings={
            roomState?.settings || {
              capacity: 8,
              language: "English",
              drawTime: 80,
              rounds: 3,
              gameMode: "normal",
              wordCount: 1,
              hintsCount: 1,
              isPublic: true,
              category: "All Categories",
              difficulty: "all",
            }
          }
          isHost={isHost || !roomState}
          isMuted={isMuted}
          isBgmActive={isBgmActive}
          currentTrackName={currentTrack.name}
          onToggleMute={handleToggleMute}
          onToggleBgm={handleToggleBgm}
          onNextTrack={handleNextTrack}
          onPrevTrack={handlePrevTrack}
          onSave={(newSettings) => {
            if (roomState && isHost) {
              socketRef.current.emit("room:update-settings", { settings: newSettings });
            }
          }}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showPublicRooms && (
        <PublicRoomsModal
          rooms={publicRooms}
          onJoinRoom={(code) => handleJoinRoom(code)}
          onCreateRoom={() => handleCreateRoom({ isPublic: true })}
          onRefresh={fetchPublicRooms}
          onClose={() => setShowPublicRooms(false)}
        />
      )}

      {showNoticeBoard && (
        <NoticeBoardModal
          onClose={() => setShowNoticeBoard(false)}
          championName={championName}
        />
      )}

      {showAccount && (
        <AccountModal
          user={user}
          onClose={() => setShowAccount(false)}
          onLogout={() => {
            fetch(`${API_BASE}/api/auth/logout`, { method: "POST" }).then(() => {
              setUser(null);
              setShowAccount(false);
            });
          }}
          onGoogleLogin={handleGoogleLogin}
          onUpdateProfile={(profileData) => {
            if (user) {
              fetch(`${API_BASE}/api/user/update`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userId: user.id,
                  displayName: profileData.displayName,
                  username: profileData.username,
                  country: profileData.country,
                  state: profileData.state,
                  city: profileData.city,
                }),
              })
                .then((res) => res.json())
                .then((data) => {
                  if (data.user) setUser(data.user);
                });
            }
          }}
        />
      )}

      {showLeaderboard && <LeaderboardModal onClose={() => setShowLeaderboard(false)} />}
    </main>
  );
}
