import { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, Pause, RotateCcw, Volume2, Loader2 } from "lucide-react";

interface VoiceClueRecorderProps {
  onSubmit: (audioUrl: string, transcript: string) => void;
  disabled?: boolean;
}

export function VoiceClueRecorder({ onSubmit, disabled }: VoiceClueRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + " ";
          }
          setTranscript(currentTranscript.trim());
        };

        recognition.onerror = () => {};
        recognitionRef.current = recognition;
      } catch (e) {
        // Speech recognition not supported or denied
      }
    }
  }, []);

  const startRecording = async () => {
    try {
      setMicError(null);
      audioChunksRef.current = [];
      setTranscript("");
      setAudioUrl(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/ogg;codecs=opus")
        ? "audio/ogg;codecs=opus"
        : "audio/webm";

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 24000, // 24kbps mono Opus for millisecond transmission (< 15KB per clue)
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setAudioUrl(base64data);
        };
        // Stop all tracks on mic stream
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(200);
      setIsRecording(true);
      setRecordingSeconds(0);

      // Start timer (Max 10 seconds for concise party game hints)
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 9) {
            stopRecording();
            return 10;
          }
          return prev + 1;
        });
      }, 1000);

      // Start speech recognition
      try {
        recognitionRef.current?.start();
      } catch (err) {}
    } catch (err: any) {
      console.error("[VoiceClue] Microphone access error:", err);
      setMicError("Microphone permission denied. Please allow microphone access in your browser.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    try {
      recognitionRef.current?.stop();
    } catch (err) {}
  };

  const togglePlayback = () => {
    if (!audioPlayerRef.current && audioUrl) {
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlaying(false);
      audioPlayerRef.current = audio;
    }

    if (audioPlayerRef.current) {
      if (isPlaying) {
        audioPlayerRef.current.pause();
        setIsPlaying(false);
      } else {
        audioPlayerRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleReset = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    setAudioUrl(null);
    setTranscript("");
    setIsPlaying(false);
    setRecordingSeconds(0);
  };

  const handleSubmit = () => {
    if (audioUrl) {
      onSubmit(audioUrl, transcript);
    }
  };

  return (
    <div className="sketch bg-white/95 p-4 sm:p-5 border-2 border-accent space-y-4 font-hand shadow-xs">
      <div className="flex items-center justify-between border-b border-foreground/20 pb-2">
        <div className="flex items-center gap-2">
          <Mic className="h-5 w-5 text-accent animate-pulse" />
          <span className="font-display text-xl sm:text-2xl text-foreground font-bold">
            Live Voice Clue 🎙️
          </span>
        </div>
        <span className="text-xs font-bold text-muted-foreground uppercase">
          Max 10s voice hint
        </span>
      </div>

      {micError && (
        <div className="bg-destructive/15 text-destructive p-3 rounded text-xs sm:text-sm border border-destructive/30">
          ⚠️ {micError}
        </div>
      )}

      {/* Recording State */}
      {!audioUrl && (
        <div className="text-center py-4 space-y-4">
          {!isRecording ? (
            <button
              type="button"
              disabled={disabled}
              onClick={startRecording}
              className="sketch group mx-auto flex flex-col items-center justify-center h-28 w-28 sm:h-32 sm:w-32 rounded-full bg-accent text-accent-foreground hover:scale-105 transition-all shadow-md active:scale-95"
            >
              <Mic className="h-10 w-10 sm:h-12 sm:w-12 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold pt-1">TAP TO SPEAK</span>
            </button>
          ) : (
            <div className="space-y-3">
              <div className="relative mx-auto flex items-center justify-center h-28 w-28 rounded-full bg-destructive text-white animate-pulse shadow-lg">
                <Square className="h-10 w-10 cursor-pointer" onClick={stopRecording} />
                <span className="absolute -bottom-2 bg-white text-destructive px-2 py-0.5 rounded-full text-xs font-bold border border-destructive shadow-xs">
                  0:0{recordingSeconds} / 0:10
                </span>
              </div>
              <p className="text-xs text-foreground font-bold animate-pulse">
                🎙️ Listening... Speak your subtle hint clearly!
              </p>
              <button
                type="button"
                onClick={stopRecording}
                className="sketch bg-secondary px-4 py-1.5 text-xs font-bold hover:bg-secondary/80"
              >
                ⏹️ Done Speaking
              </button>
            </div>
          )}

          {transcript && (
            <div className="sketch bg-highlight/30 p-2.5 text-xs italic text-foreground max-w-sm mx-auto">
              🗣️ "{transcript}"
            </div>
          )}
        </div>
      )}

      {/* Recorded Preview State */}
      {audioUrl && (
        <div className="sketch bg-highlight/20 p-4 space-y-3 border border-foreground/30 text-center">
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={togglePlayback}
              className="sketch flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 text-sm font-bold shadow-xs hover:brightness-110"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlaying ? "Pause Preview" : "Listen Preview ▶"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="sketch flex items-center gap-1 bg-secondary px-3 py-2 text-xs font-bold hover:bg-secondary/80"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Re-record
            </button>
          </div>

          {transcript && (
            <div className="text-sm font-bold text-foreground italic pt-1">
              Transcribed: "{transcript}"
            </div>
          )}

          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={handleSubmit}
              className="sketch w-full max-w-xs bg-accent text-accent-foreground py-2.5 text-base font-bold shadow-sm hover:brightness-110 active:scale-98"
            >
              Submit Voice Clue 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function VoiceCluePlayer({ audioUrl, transcript }: { audioUrl: string; transcript?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleToggle = () => {
    if (!audioRef.current) {
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlaying(false);
      audioRef.current = audio;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="sketch bg-highlight/40 p-3 space-y-2 border border-foreground/30 font-hand">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleToggle}
          className={`sketch flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold shadow-2xs transition-all ${
            isPlaying ? "bg-accent text-accent-foreground animate-pulse" : "bg-primary text-primary-foreground"
          }`}
        >
          {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {isPlaying ? "Playing Voice Clue..." : "Play Voice Clue 🎙️"}
        </button>
        <span className="text-[11px] font-bold text-muted-foreground uppercase">
          Voice Hint
        </span>
      </div>

      {transcript && (
        <div className="text-xs sm:text-sm text-foreground italic bg-white/70 p-2 rounded border border-foreground/20">
          🗣️ "{transcript}"
        </div>
      )}
    </div>
  );
}
