import React, { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "sonner";
import { Mic, MicOff, Hand, CheckCircle2, FastForward } from "lucide-react";
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
  const [isSpeakingLocally, setIsSpeakingLocally] = useState<boolean>(false);
  const [activeSpeakers, setActiveSpeakers] = useState<Set<string>>(new Set());

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

  // Handle peer connection creation
  const createPeerConnection = useCallback(
    (targetSocketId: string) => {
      if (peerConnectionsRef.current.has(targetSocketId)) {
        return peerConnectionsRef.current.get(targetSocketId)!;
      }

      const pc = new RTCPeerConnection(ICE_SERVERS);

      if (localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach((track) => {
          pc.addTrack(track, localStreamRef.current!);
        });
      }

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("voice:signal", {
            to: targetSocketId,
            signal: event.candidate,
            type: "candidate",
          });
        }
      };

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
      if (localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach((track) => {
          track.enabled = false;
        });
      }
      setIsMicOn(false);
      setIsSpeakingLocally(false);
      socket.emit("voice:speaking", { isSpeaking: false });
      socket.emit("voice:state-change", { isMuted: true });
      toast.info("Mic Muted 🔇");
    } else {
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

          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            const audioCtx = new AudioContextClass();
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;
            const source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);
            audioContextRef.current = audioCtx;
            analyserRef.current = analyser;

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

          peerConnectionsRef.current.forEach((pc) => {
            stream.getAudioTracks().forEach((track) => {
              pc.addTrack(track, stream);
            });
          });

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
        toast.success("Mic Live 🎙️");
      } catch (err: any) {
        toast.error("Microphone permission required");
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
      } catch (err) {}
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

    socket.on("voice:signal", handleSignal);
    socket.on("voice:speaking", handleSpeaking);

    return () => {
      socket.off("voice:signal", handleSignal);
      socket.off("voice:speaking", handleSpeaking);
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
        toast.success("Floor passed 🎙️");
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
          toast.info("Hand raised 🙋");
        } else {
          toast.info("Hand lowered");
        }
      }
    });
  };

  const currentSpeakerIsTalking = Boolean(
    (speakerFloor?.currentSpeakerSocketId && activeSpeakers.has(speakerFloor.currentSpeakerSocketId)) ||
    (isMyFloor && isSpeakingLocally)
  );

  return (
    <div className="font-hand">
      {/* COMPACT & MOBILE-FRIENDLY SPEAKER FLOOR STRIP */}
      <div
        className={`sketch relative p-2.5 sm:p-3.5 border-2 shadow-xs transition-all ${
          isMyFloor
            ? "bg-amber-50/95 border-amber-500 ring-2 ring-amber-400/40"
            : speakerFloor?.isOpenFloor
            ? "bg-emerald-50/95 border-emerald-500"
            : "bg-white/95 border-primary shadow-xs"
        }`}
      >
        <div className="tape absolute -top-2.5 left-6 h-4 w-16 rotate-[-1deg]" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Left: Speaker Identity & Status */}
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Compact Avatar/Icon */}
            <div className="relative shrink-0">
              <div
                className={`h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center text-lg font-bold border ${
                  isMyFloor
                    ? "bg-amber-400 text-amber-950 border-amber-600 animate-pulse"
                    : speakerFloor?.isOpenFloor
                    ? "bg-emerald-400 text-emerald-950 border-emerald-600"
                    : "bg-primary/15 text-primary border-primary/40"
                }`}
              >
                {isMyFloor ? "🌟" : speakerFloor?.isOpenFloor ? "🗣️" : "🎙️"}
              </div>

              {currentSpeakerIsTalking && (
                <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              )}
            </div>

            {/* Name & Turn Indicator */}
            <div className="min-w-0 leading-tight">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span
                  className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded font-mono ${
                    isMyFloor
                      ? "bg-amber-500 text-white"
                      : speakerFloor?.isOpenFloor
                      ? "bg-emerald-600 text-white"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  {isMyFloor
                    ? "YOUR TURN"
                    : speakerFloor?.isOpenFloor
                    ? "OPEN FLOOR"
                    : `TURN ${((speakerFloor?.speakerIndex || 0) + 1)}/${speakerFloor?.totalSpeakers || players.length}`}
                </span>

                {!speakerFloor?.isOpenFloor && speakerTimeRemaining > 0 && (
                  <span className="text-[10px] sm:text-xs font-mono font-bold text-accent">
                    {speakerTimeRemaining}s
                  </span>
                )}
              </div>

              <div className="text-sm sm:text-base font-display font-bold text-foreground truncate mt-0.5">
                {isMyFloor ? (
                  <span className="text-amber-800">You are speaking</span>
                ) : speakerFloor?.isOpenFloor ? (
                  <span className="text-emerald-800">Open Debate</span>
                ) : (
                  <span>
                    Speaking:{" "}
                    <strong className="text-primary">
                      {speakerFloor?.currentSpeakerName || "Classmate"}
                    </strong>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Controls (Mic, Done/Hand, Skip) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 self-end sm:self-auto">
            {/* Live Mic Toggle */}
            <button
              type="button"
              onClick={toggleMic}
              className={`sketch px-2.5 py-1 text-xs font-bold font-mono flex items-center gap-1 transition-all ${
                isMicOn
                  ? "bg-emerald-600 text-white animate-pulse"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
              title={isMicOn ? "Mute Microphone" : "Turn on Microphone"}
            >
              {isMicOn ? <Mic className="h-3.5 w-3.5" /> : <MicOff className="h-3.5 w-3.5 text-muted-foreground" />}
              <span>{isMicOn ? "Mic ON" : "Mic"}</span>
            </button>

            {/* If My Turn: Done Button */}
            {isMyFloor && (
              <button
                type="button"
                onClick={handlePassFloor}
                className="sketch bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 font-bold text-xs sm:text-sm flex items-center gap-1 shadow-xs transition-transform active:scale-95 animate-pulse"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Done ➔</span>
              </button>
            )}

            {/* If Not My Turn: Raise Hand Button */}
            {!isMyFloor && !speakerFloor?.isOpenFloor && (
              <button
                type="button"
                onClick={handleToggleRaiseHand}
                className={`sketch px-2.5 py-1 text-xs font-bold flex items-center gap-1 transition-all ${
                  isHandRaised
                    ? "bg-amber-400 text-amber-950 border-amber-600 ring-1 ring-amber-300"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
                title={isHandRaised ? "Lower Hand" : "Raise Hand to Speak"}
              >
                <Hand className={`h-3.5 w-3.5 ${isHandRaised ? "animate-bounce" : ""}`} />
                <span>{isHandRaised ? "✋ Hand" : "Hand"}</span>
              </button>
            )}

            {/* Skip Discussion Vote */}
            <button
              type="button"
              onClick={onVoteSkip}
              disabled={hasVotedSkip}
              className={`sketch px-2.5 py-1 text-xs font-bold flex items-center gap-1 transition-all ${
                hasVotedSkip
                  ? "bg-secondary text-foreground/50 border-foreground/30 cursor-not-allowed"
                  : "bg-accent/80 hover:bg-accent text-accent-foreground"
              }`}
              title="Skip debate and start secret voting"
            >
              <FastForward className="h-3 w-3" />
              <span>{hasVotedSkip ? "Voted" : "Skip"}</span>
              <span className="bg-black/15 text-[9px] px-1 py-0.2 rounded font-mono font-bold">
                {skipDiscussionVotesCount}/{skipDiscussionRequired}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
