// Web Audio API Sound Engine (100% self-contained, no external MP3 network dependencies)

export interface MusicTrack {
  id: number;
  name: string;
  artist: string;
  mood: string;
  bpm: number;
  scale: number[];
  chords: number[][];
  type: OscillatorType;
}

export const RELAXING_TRACKS: MusicTrack[] = [
  {
    id: 1,
    name: "Lo-Fi Study Lounge",
    artist: "Notebook Beats",
    mood: "☕ Warm Rhodes 7th Chords",
    bpm: 72,
    scale: [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88], // C major
    chords: [
      [261.63, 329.63, 392.0, 493.88], // Cmaj7
      [220.0, 261.63, 329.63, 392.0],   // Am7
      [293.66, 349.23, 440.0, 523.25],  // Dm7
      [196.0, 261.63, 293.66, 392.0],   // G7sus4
    ],
    type: "sine",
  },
  {
    id: 2,
    name: "Rainy Afternoon Kalimba",
    artist: "Window Rain",
    mood: "🌧️ Soft Pentatonic Bells",
    bpm: 64,
    scale: [174.61, 196.0, 220.0, 261.63, 293.66], // F pentatonic
    chords: [
      [174.61, 261.63, 349.23, 440.0],  // F
      [220.0, 261.63, 329.63, 440.0],   // Am
      [146.83, 220.0, 293.66, 349.23],  // Dm
      [196.0, 246.94, 293.66, 392.0],   // G
    ],
    type: "triangle",
  },
  {
    id: 3,
    name: "Classroom Daydream",
    artist: "Last Bench Vibes",
    mood: "☁️ Ambient Warm Pads",
    bpm: 60,
    scale: [196.0, 220.0, 246.94, 293.66, 329.63, 370.0], // G major
    chords: [
      [196.0, 246.94, 293.66, 370.0],   // Gmaj7
      [164.81, 196.0, 246.94, 293.66],  // Em7
      [246.94, 293.66, 370.0, 440.0],   // Bm7
      [130.81, 196.0, 246.94, 329.63],  // Cmaj7
    ],
    type: "sine",
  },
  {
    id: 4,
    name: "Midnight Notebook",
    artist: "Sleepy Detective",
    mood: "🌙 Gentle Plucks & Breeze",
    bpm: 68,
    scale: [220.0, 246.94, 261.63, 293.66, 329.63, 349.23], // A natural minor
    chords: [
      [220.0, 261.63, 329.63, 392.0],   // Am7
      [174.61, 220.0, 261.63, 329.63],  // Fmaj7
      [146.83, 220.0, 261.63, 349.23],  // Dm
      [164.81, 220.0, 246.94, 329.63],  // Em7
    ],
    type: "triangle",
  },
];

class SoundEngine {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private isBgmPlaying = false;
  private bgmTimer: any = null;
  public isMuted = false;

  public currentTrackIndex = 0;
  private trackListeners: Array<(trackIndex: number, track: MusicTrack) => void> = [];
  private barCount = 0;

  constructor() {
    if (typeof window !== "undefined") {
      this.isMuted = localStorage.getItem("imposter_sound_muted") === "true";
      const savedTrack = parseInt(localStorage.getItem("imposter_bgm_track") || "0", 10);
      if (!isNaN(savedTrack) && savedTrack >= 0 && savedTrack < RELAXING_TRACKS.length) {
        this.currentTrackIndex = savedTrack;
      }
    }
  }

  public onTrackChange(callback: (trackIndex: number, track: MusicTrack) => void) {
    this.trackListeners.push(callback);
    const track = RELAXING_TRACKS[this.currentTrackIndex];
    if (track) callback(this.currentTrackIndex, track);
    return () => {
      this.trackListeners = this.trackListeners.filter((cb) => cb !== callback);
    };
  }

  private notifyTrackChange() {
    const track = RELAXING_TRACKS[this.currentTrackIndex];
    if (!track) return;
    for (const listener of this.trackListeners) {
      try {
        listener(this.currentTrackIndex, track);
      } catch {}
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.bgmGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();

        // Warm analog low-pass filter for cozy lo-fi character
        this.filterNode = this.ctx.createBiquadFilter();
        this.filterNode.type = "lowpass";
        this.filterNode.frequency.value = 1600; // roll off harsh highs
        this.filterNode.Q.value = 0.7;

        this.bgmGain.gain.value = this.isMuted ? 0 : 0.085; // soft soothing level
        this.sfxGain.gain.value = this.isMuted ? 0 : 0.32; // SFX volume

        this.bgmGain.connect(this.filterNode);
        this.filterNode.connect(this.ctx.destination);
        this.sfxGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== "undefined") {
      localStorage.setItem("imposter_sound_muted", String(this.isMuted));
    }
    if (this.bgmGain && this.sfxGain) {
      this.bgmGain.gain.value = this.isMuted ? 0 : 0.085;
      this.sfxGain.gain.value = this.isMuted ? 0 : 0.32;
    }
    if (this.isMuted) {
      this.stopBgm();
    } else {
      this.startBgm();
    }
    return this.isMuted;
  }

  public nextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % RELAXING_TRACKS.length;
    this.saveTrackPreference();
    this.notifyTrackChange();
    if (this.isBgmPlaying) {
      this.restartBgm();
    }
  }

  public prevTrack() {
    this.currentTrackIndex =
      (this.currentTrackIndex - 1 + RELAXING_TRACKS.length) % RELAXING_TRACKS.length;
    this.saveTrackPreference();
    this.notifyTrackChange();
    if (this.isBgmPlaying) {
      this.restartBgm();
    }
  }

  public setTrack(idx: number) {
    if (idx >= 0 && idx < RELAXING_TRACKS.length) {
      this.currentTrackIndex = idx;
      this.saveTrackPreference();
      this.notifyTrackChange();
      if (this.isBgmPlaying) {
        this.restartBgm();
      }
    }
  }

  private saveTrackPreference() {
    if (typeof window !== "undefined") {
      localStorage.setItem("imposter_bgm_track", String(this.currentTrackIndex));
    }
  }

  public getCurrentTrack(): MusicTrack {
    return RELAXING_TRACKS[this.currentTrackIndex] || RELAXING_TRACKS[0]!;
  }

  // --- SOUND EFFECTS ---

  public playPop() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(420, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(840, this.ctx.currentTime + 0.07);

    gain.gain.setValueAtTime(0.28, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.07);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.07);
  }

  public playPencil() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(1100 + Math.random() * 400, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(750, this.ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
      }, i * 55);
    }
  }

  public playDing() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1760, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }

  public playTick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(900, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.03);
  }

  public playLock() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.setValueAtTime(480, this.ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.14);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.14);
  }

  public playVictory() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const melody = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    melody.forEach((freq, i) => {
      setTimeout(() => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.28, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.5);
      }, i * 130);
    });
  }

  public playImposterWin() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const chords = [392.0, 370.0, 349.23, 311.13];
    chords.forEach((freq, i) => {
      setTimeout(() => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.6);
      }, i * 150);
    });
  }

  // --- COZY MULTI-TRACK LO-FI GENERATIVE MUSIC ---

  public startBgm() {
    if (this.isMuted || this.isBgmPlaying) return;
    this.initContext();
    if (!this.ctx || !this.bgmGain) return;

    this.isBgmPlaying = true;
    this.barCount = 0;
    this.scheduleNextBar();
  }

  private scheduleNextBar() {
    if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;

    const track = this.getCurrentTrack();
    const chordIndex = this.barCount % track.chords.length;
    const chord = track.chords[chordIndex] || [261.63, 329.63, 392.0];

    // Bar duration calculated from BPM (4 beats per bar)
    const beatSec = 60 / track.bpm;
    const barSec = beatSec * 4;

    // Play chord voicing with warm gentle envelope
    chord.forEach((freq, nIdx) => {
      const delay = nIdx * (beatSec * 0.45);
      setTimeout(() => {
        if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = track.type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        // Soft attack, long sustain, soothing decay
        const now = this.ctx.currentTime;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.065, now + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + barSec * 0.9);

        osc.connect(gain);
        gain.connect(this.bgmGain!);
        osc.start(now);
        osc.stop(now + barSec * 0.9);
      }, delay * 1000);
    });

    // Add subtle ambient high pluck note for sparkle
    const sparkleScale = track.scale;
    const highNote = sparkleScale[Math.floor(Math.random() * sparkleScale.length)]! * 2;
    setTimeout(() => {
      if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(highNote, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.035, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(this.bgmGain!);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.6);
    }, (barSec * 0.6) * 1000);

    this.barCount++;

    // Auto-advance track after 8 bars (~28-32 seconds) so music naturally changes and auto-switches songs!
    if (this.barCount >= 8) {
      this.barCount = 0;
      this.currentTrackIndex = (this.currentTrackIndex + 1) % RELAXING_TRACKS.length;
      this.saveTrackPreference();
      this.notifyTrackChange();
    }

    this.bgmTimer = setTimeout(() => {
      this.scheduleNextBar();
    }, barSec * 1000);
  }

  private restartBgm() {
    this.stopBgm();
    this.startBgm();
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
    this.notifyTrackChange();
  }

  public getBgmStatus() {
    return this.isBgmPlaying && !this.isMuted;
  }
}

export const sound = new SoundEngine();
