import React, { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "sonner";
import { Mic, MicOff, Volume2, Hand, CheckCircle2, FastForward, Sparkles, AlertCircle } from "lucide-react";
import { sound } from "@/lib/sound";

interface Player {
  socketId: string;
  userId: string;
  displayName: string;
  avatarUrl: string;
  isHost: boolean;
  score: number;
  isConnected: boolean;
}

interface SpeakerFloorData {
  currentSpeakerSocketId: string | null;
  currentSpeakerName: string | null;
  speakerIndex: number;
  totalSpeakers: number;
  speakerDeadline: number | null;
  handsRaised: string[];
  isOpenFloor: boolean;
}

interface VoiceDiscussionFloorProps {
  socket: any;
  roomCode: string;
  myPlayer: Player | undefined;
  players: Player[];
  speakerFloor: SpeakerFloorData | undefined;
  remainingTime: number;
  skipDiscussionVotesCount: number;
  skipDiscussionRequired: number;
  hasVotedSkip: boolean;
  onVoteSkip: () => void;
}

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

export function VoiceDiscussionFloor({
  socket,
  roomCode,
  myPlayer,
  players,
  speakerFloor,
  remainingTime,
  skipDiscussionVotesCount,
  skipDiscussionRequired,
  hasVotedSkip,
  onVoteSkip,
}: VoiceDiscussionFloorProps) {
  // Voice State
  const [isMicOn, setIsMicOn] = useState<boolean>(false);
  const [isMicPermissionGranted, setIsMicPermissionGranted] = useState<boolean>(false);
  const [isSpeakingLocally, setIsSpeakingLocally] = useState<boolean>(false);
  const [activeSpeakers, setActiveSpeakers] = useState<Set<string>>(new Set());
  const [mutedPeers, setMutedPeers] = useState<Set<string>>(new Set());
  const [reactions, setReactions] = useState<{ id: string; emoji: string; playerName: string }[]>([]);

  // WebRTC Refs
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const remoteAudiosRef = useRef<Map<string, HTMLAudioElement>>(new Map());

  // Current Speaker countdown calculation
  const [speakerTimeRemaining, setSpeakerTimeRemaining] = useState<number>(35);

  const isMyFloor = Boolean(
    speakerFloor &&
    speakerFloor.currentSpeakerSocketId &&
    myPlayer &&
    speakerFloor.currentSpeakerSocketId === myPlayer.socketId
  );

  const isHandRaised = Boolean(
    speakerFloor &&
    myPlayer &&
    speakerFloor.handsRaised?.includes(myPlayer.socketId)
  );

  // Update speaker deadline countdown timer
  useEffect(() => {
    if (!speakerFloor?.speakerDeadline) {
      setSpeakerTimeRemaining(0);
      return;
    }

    const updateTimer = () => {
      const msLeft = Math.max(0, (speakerFloor.speakerDeadline || 0) - Date.now());
      setSpeakerTimeRemaining(Math.ceil(msLeft / 1000));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 500);
    return () => clearInterval(interval);
  }, [speakerFloor?.speakerDeadline]);

  // Clean up floating reactions after 3s
  useEffect(() => {
    if (reactions.length === 0) return;
    const timer = setTimeout(() => {
      setReactions((prev) => prev.slice(1));
    }, 2800);
    return () => clearTimeout(timer);
  }, [reactions]);

  // Handle peer connection creation
  const createPeerConnection = useCallback(
    (targetSocketId: string) => {
      if (peerConnectionsRef.current.has(targetSocketId)) {
        return peerConnectionsRef.current.get(targetSocketId)!;
      }

      const pc = new RTCPeerConnection(ICE_SERVERS);

      // Add local audio tracks if mic is active
      if (localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach((track) => {
          pc.addTrack(track, localStreamRef.current!);
        });
      }

      // Handle ICE Candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("voice:signal", {
            to: targetSocketId,
            signal: event.candidate,
            type: "candidate",
          });
        }
      };

      // Handle remote incoming audio stream
      pc.ontrack = (event) => {
        const stream = event.streams[0];
        let audioEl = remoteAudiosRef.current.get(targetSocketId);
        if (!audioEl) {
          audioEl = new Audio();
          audioEl.autoplay = true;
          // @ts-ignore
          audioEl.playsInline = true;
          remoteAudiosRef.current.set(targetSocketId, audioEl);
        }
        audioEl.srcObject = stream;
        audioEl.play().catch(() => {});
      };

      peerConnectionsRef.current.set(targetSocketId, pc);
      return pc;
    },
    [socket]
  );

  // Toggle Live Microphone
  const toggleMic = async () => {
    sound.playPop();
    if (isMicOn) {
      // Mute local microphone
      if (localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach((track) => {
          track.enabled = false;
        });
      }
      setIsMicOn(false);
      setIsSpeakingLocally(false);
      socket.emit("voice:speaking", { isSpeaking: false });
      socket.emit("voice:state-change", { isMuted: true });
      toast.info("Microphone muted 🔇");
    } else {
      // Unmute / Initialize microphone stream
      try {
        if (!localStreamRef.current) {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
          });
          localStreamRef.current = stream;
          setIsMicPermissionGranted(true);

          // Audio Analyzer for speaking activity detection
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            const audioCtx = new AudioContextClass();
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;
            const source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);
            audioContextRef.current = audioCtx;
            analyserRef.current = analyser;

            // Voice level loop
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            let speakingState = false;

            const checkVolume = () => {
              if (analyserRef.current && localStreamRef.current?.getAudioTracks()[0]?.enabled) {
                analyserRef.current.getByteFrequencyData(dataArray);
                const avg = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
                const isNowSpeaking = avg > 14;

                if (isNowSpeaking !== speakingState) {
                  speakingState = isNowSpeaking;
                  setIsSpeakingLocally(isNowSpeaking);
                  socket.emit("voice:speaking", { isSpeaking: isNowSpeaking });
                }
              }
              animFrameRef.current = requestAnimationFrame(checkVolume);
            };
            animFrameRef.current = requestAnimationFrame(checkVolume);
          }

          // Connect tracks to all existing peer connections
          peerConnectionsRef.current.forEach((pc) => {
            stream.getAudioTracks().forEach((track) => {
              pc.addTrack(track, stream);
            });
          });

          // Connect to all other connected room players
          players
            .filter((p) => p.socketId !== myPlayer?.socketId && p.isConnected)
            .forEach(async (peer) => {
              const pc = createPeerConnection(peer.socketId);
              try {
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                socket.emit("voice:signal", {
                  to: peer.socketId,
                  signal: offer,
                  type: "offer",
                });
              } catch (err) {}
            });
        } else {
          localStreamRef.current.getAudioTracks().forEach((track) => {
            track.enabled = true;
          });
        }

        setIsMicOn(true);
        socket.emit("voice:state-change", { isMuted: false });
        toast.success("Live Microphone ON! 🎙️ Everyone can hear you.");
      } catch (err: any) {
        console.error("[VoiceFloor] Mic access error:", err);
        toast.error("Could not access microphone. Please allow mic permission in your browser.");
      }
    }
  };

  // Socket WebRTC Signal Listeners
  useEffect(() => {
    if (!socket) return;

    const handleSignal = async ({ from, signal, type }: { from: string; signal: any; type: string }) => {
      const pc = createPeerConnection(from);

      try {
        if (type === "offer") {
          await pc.setRemoteDescription(new RTCSessionDescription(signal));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("voice:signal", {
            to: from,
            signal: answer,
            type: "answer",
          });
        } else if (type === "answer") {
          await pc.setRemoteDescription(new RTCSessionDescription(signal));
        } else if (type === "candidate") {
          await pc.addIceCandidate(new RTCIceCandidate(signal));
        }
      } catch (err) {
        console.warn("[VoiceFloor] Signal error:", err);
      }
    };

    const handleSpeaking = ({ socketId, isSpeaking }: { socketId: string; isSpeaking: boolean }) => {
      setActiveSpeakers((prev) => {
        const next = new Set(prev);
        if (isSpeaking) {
          next.add(socketId);
        } else {
          next.delete(socketId);
        }
        return next;
      });
    };

    const handleStateChange = ({ socketId, isMuted }: { socketId: string; isMuted: boolean }) => {
      setMutedPeers((prev) => {
        const next = new Set(prev);
        if (isMuted) {
          next.add(socketId);
        } else {
          next.delete(socketId);
        }
        return next;
      });
    };

    socket.on("voice:signal", handleSignal);
    socket.on("voice:speaking", handleSpeaking);
    socket.on("voice:state-change", handleStateChange);

    return () => {
      socket.off("voice:signal", handleSignal);
      socket.off("voice:speaking", handleSpeaking);
      socket.off("voice:state-change", handleStateChange);
    };
  }, [socket, createPeerConnection]);

  // Clean up WebRTC on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      peerConnectionsRef.current.forEach((pc) => pc.close());
      peerConnectionsRef.current.clear();
      remoteAudiosRef.current.forEach((audio) => {
        audio.srcObject = null;
        audio.remove();
      });
      remoteAudiosRef.current.clear();
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Pass Floor Action ("Done" button)
  const handlePassFloor = () => {
    sound.playDing();
    socket.emit("game:pass-speaker-floor", {}, (res: any) => {
      if (res && res.success) {
        toast.success("Floor passed to next student! 🎙️");
      } else if (res && res.error) {
        toast.error(res.error);
      }
    });
  };

  // Toggle Raise Hand Action
  const handleToggleRaiseHand = () => {
    sound.playPop();
    socket.emit("game:raise-hand", {}, (res: any) => {
      if (res && res.success) {
        if (res.raised) {
          toast.info("Hand raised! The classroom sees you want to speak. 🙋‍♂️");
        } else {
          toast.info("Hand lowered.");
        }
      }
    });
  };

  // Send Floating Emoji Reaction
  const sendReaction = (emoji: string) => {
    sound.playPop();
    const newReaction = {
      id: Math.random().toString(),
      emoji,
      playerName: myPlayer?.displayName || "Student",
    };
    setReactions((prev) => [...prev.slice(-5), newReaction]);
  };

  return (
    <div className="space-y-3 font-hand">
      {/* 1. MAIN SPEAKER SPOTLIGHT BANNER ("Hotseat") */}
      <div
        className={`sketch relative p-4 sm:p-5 border-2 shadow-md transition-all duration-300 overflow-hidden ${
          isMyFloor
            ? "bg-amber-50/95 border-amber-500 ring-2 ring-amber-400/50"
            : speakerFloor?.isOpenFloor
            ? "bg-emerald-50/95 border-emerald-500"
            : "bg-white/95 border-primary shadow-xs"
        }`}
      >
        <div className="tape absolute -top-3 left-8 h-5 w-24 rotate-[-1deg]" />

        {/* Floating live emoji reactions */}
        {reactions.length > 0 && (
          <div className="absolute right-4 top-2 flex flex-col items-end gap-1 pointer-events-none z-10">
            {reactions.map((r) => (
              <div
                key={r.id}
                className="animate-in fade-in slide-in-from-bottom-3 duration-300 bg-black/80 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg"
              >
                <span className="text-base">{r.emoji}</span>
                <span className="font-mono text-[10px] font-bold opacity-80">{r.playerName}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left Info: Speaker Status */}
          <div className="flex items-start sm:items-center gap-3.5 min-w-0">
            <div className="relative shrink-0">
              <div
                className={`h-14 w-14 sm:h-16 sm:w-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-inner border-2 ${
                  isMyFloor
                    ? "bg-amber-400 text-amber-950 border-amber-600 animate-pulse ring-4 ring-amber-300"
                    : speakerFloor?.isOpenFloor
                    ? "bg-emerald-400 text-emerald-950 border-emerald-600"
                    : "bg-primary/20 text-primary border-primary"
                }`}
              >
                {isMyFloor ? "🌟" : speakerFloor?.isOpenFloor ? "🗣️" : "🎙️"}
              </div>

              {/* Pulsing voice wave indicator if currently speaking */}
              {(isSpeakingLocally || (speakerFloor?.currentSpeakerSocketId && activeSpeakers.has(speakerFloor.currentSpeakerSocketId))) && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                </span>
              )}
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-mono ${
                    isMyFloor
                      ? "bg-amber-500 text-white animate-bounce"
                      : speakerFloor?.isOpenFloor
                      ? "bg-emerald-600 text-white"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {isMyFloor
                    ? "🌟 You Have The Floor!"
                    : speakerFloor?.isOpenFloor
                    ? "🗣️ Open Floor Discussion"
                    : `Speaker Turn ${((speakerFloor?.speakerIndex || 0) + 1)}/${speakerFloor?.totalSpeakers || players.length}`}
                </span>

                {/* Speaker Countdown */}
                {!speakerFloor?.isOpenFloor && speakerTimeRemaining > 0 && (
                  <span className="sketch bg-accent text-accent-foreground text-xs font-mono font-bold px-2 py-0.5">
                    ⏱️ {speakerTimeRemaining}s
                  </span>
                )}
              </div>

              {/* Speaker Headline */}
              <h3 className="text-xl sm:text-2xl font-display font-bold text-foreground truncate">
                {isMyFloor ? (
                  <span className="text-amber-800">Your Turn To Speak! Explain your clue.</span>
                ) : speakerFloor?.isOpenFloor ? (
                  <span className="text-emerald-800">Anyone can talk & interrogate freely!</span>
                ) : (
                  <span>
                    Now Speaking:{" "}
                    <strong className="text-primary underline decoration-wavy">
                      {speakerFloor?.currentSpeakerName || "Classmate"}
                    </strong>
                  </span>
                )}
              </h3>

              {/* Subtitle guidance */}
              <p className="text-xs sm:text-sm text-foreground/80">
                {isMyFloor ? (
                  <span>
                    Sabka mic live on hai. Aap apna clue justify karein, phir neeche <strong>"Done"</strong> click karke agle student ko pass karein!
                  </span>
                ) : speakerFloor?.isOpenFloor ? (
                  <span>
                    Sabhi students ne apna clue share kar diya hai. Remaining time me cross-examination aur voting discuss karein.
                  </span>
                ) : (
                  <span>
                    Inka point suniye! Aapka mic bhi on hai — par floor inka hai. Interjection ke liye "Raise Hand" use karein.
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-stretch sm:self-auto justify-end">
            {/* If IT IS MY TURN: Big Done / Pass Button */}
            {isMyFloor && (
              <button
                type="button"
                onClick={handlePassFloor}
                className="sketch bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 font-bold text-sm sm:text-base flex items-center gap-2 shadow-sm transition-transform active:scale-95 animate-pulse"
              >
                <CheckCircle2 className="h-5 w-5" />
                <span>Done / Pass Floor ➔</span>
              </button>
            )}

            {/* If NOT my turn: Raise Hand Button */}
            {!isMyFloor && !speakerFloor?.isOpenFloor && (
              <button
                type="button"
                onClick={handleToggleRaiseHand}
                className={`sketch px-3.5 py-1.5 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                  isHandRaised
                    ? "bg-amber-400 text-amber-950 border-amber-600 ring-2 ring-amber-300"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                <Hand className={`h-4 w-4 ${isHandRaised ? "animate-bounce" : ""}`} />
                <span>{isHandRaised ? "✋ Hand Raised" : "🙋 Raise Hand"}</span>
              </button>
            )}

            {/* Skip Discussion (Majority Rule) */}
            <button
              type="button"
              onClick={onVoteSkip}
              disabled={hasVotedSkip}
              className={`sketch flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all shadow-xs ${
                hasVotedSkip
                  ? "bg-secondary text-foreground/50 border-foreground/30 cursor-not-allowed"
                  : "bg-accent/80 hover:bg-accent text-accent-foreground"
              }`}
              title="Skip remaining discussion and jump to secret voting"
            >
              <FastForward className="h-3.5 w-3.5" />
              <span>{hasVotedSkip ? "Voted Skip" : "Skip Debate"}</span>
              <span className="bg-black/15 text-[10px] px-1.5 py-0.2 rounded font-mono font-bold">
                {skipDiscussionVotesCount}/{skipDiscussionRequired}
              </span>
            </button>
          </div>
        </div>

        {/* 2. LIVE SEATING & AUDIO FLOOR STRIP */}
        <div className="mt-4 pt-3 border-t border-foreground/15 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Live Mic Toggle for user */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMic}
              className={`sketch flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono text-xs font-bold transition-all shadow-xs ${
                isMicOn
                  ? "bg-emerald-600 text-white animate-pulse"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4 text-muted-foreground" />}
              <span>{isMicOn ? "Live Mic: ON 🟢" : "Turn On Mic 🎙️"}</span>
            </button>

            {isMicOn && isSpeakingLocally && (
              <span className="sketch bg-emerald-100 text-emerald-800 text-[10px] font-mono px-2 py-0.5 font-bold animate-pulse">
                Speaking... 🔊
              </span>
            )}
          </div>

          {/* Quick Reaction Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-[11px] font-bold text-muted-foreground mr-1 hidden sm:inline">React:</span>
            {[
              { emoji: "🚨", label: "Sus" },
              { emoji: "🧢", label: "Cap" },
              { emoji: "😂", label: "Lol" },
              { emoji: "🤝", label: "Agree" },
              { emoji: "👀", label: "Hmm" },
            ].map((btn) => (
              <button
                key={btn.emoji}
                type="button"
                onClick={() => sendReaction(btn.emoji)}
                className="sketch bg-secondary/70 hover:bg-secondary px-2 py-1 rounded text-xs font-bold flex items-center gap-1 transition-transform active:scale-90"
              >
                <span>{btn.emoji}</span>
                <span className="text-[10px] font-mono">{btn.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. CLASSROOM STUDENT CAROUSEL / STATUS BADGES */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {players.map((p) => {
            const isSpeaker = speakerFloor?.currentSpeakerSocketId === p.socketId;
            const hasHand = speakerFloor?.handsRaised?.includes(p.socketId);
            const isTalking = activeSpeakers.has(p.socketId) || (p.socketId === myPlayer?.socketId && isSpeakingLocally);

            return (
              <div
                key={p.socketId}
                className={`sketch shrink-0 px-2.5 py-1 rounded-sm flex items-center gap-1.5 transition-all border ${
                  isSpeaker
                    ? "bg-amber-100 border-amber-500 font-bold text-amber-950 ring-2 ring-amber-300"
                    : isTalking
                    ? "bg-emerald-100 border-emerald-500 font-bold text-emerald-950 animate-pulse"
                    : "bg-white/80 border-foreground/20 text-foreground"
                }`}
              >
                {isSpeaker ? (
                  <span className="text-amber-600 font-bold">🎙️</span>
                ) : isTalking ? (
                  <span className="text-emerald-600 font-bold">🔊</span>
                ) : (
                  <span className="text-muted-foreground">👤</span>
                )}
                <span className="truncate max-w-[90px]">{p.displayName}</span>
                {hasHand && <span className="text-xs animate-bounce">✋</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
