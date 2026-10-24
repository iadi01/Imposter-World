export interface RoomSettings {
  name: string;
  capacity: number; // 3 to 14
  language: string;
  drawTime: number; // Hint / Drawing time in seconds (default 80)
  rounds: number; // Total rounds (default 3)
  gameMode: "normal" | "double_imposter" | "word_guess";
  wordCount: number; // default 1
  hintsCount: number; // default 1 per player
  discussionTime: number; // default 120
  answerTime: number; // default 120
  isPublic: boolean;
  category?: string | undefined;
  difficulty?: ("easy" | "medium" | "hard" | "all") | undefined;
}

export interface Player {
  socketId: string;
  userId: string;
  displayName: string;
  avatarUrl: string;
  isHost: boolean;
  score: number;
  isConnected: boolean;
  disconnectDeadline?: number | undefined;
}

export type GamePhase =
  | "lobby"
  | "hint_turn"
  | "discussion"
  | "answer_submission"
  | "results"
  | "game_over";

export interface HintItem {
  playerId: string;
  playerName: string;
  type: "text" | "drawing" | "voice";
  content: string; // text string, image data URI, or audio data URI
  transcript?: string | undefined; // Live speech-to-text transcript if voice
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  content: string;
  timestamp: number;
  isSystem?: boolean;
}

// Client-safe public room state (NEVER contains secret words or imposter identities!)
export interface PublicRoomState {
  roomCode: string;
  phase: GamePhase;
  currentRound: number;
  totalRounds: number;
  settings: RoomSettings;
  players: {
    socketId: string;
    userId: string;
    displayName: string;
    avatarUrl: string;
    isHost: boolean;
    score: number;
    isConnected: boolean;
    hasSubmittedAnswer?: boolean;
  }[];
  activePlayerSocketId: string | null;
  activePlayerName: string | null;
  phaseDeadline: number | null; // epoch ms
  lobbyDeadline?: number | null; // epoch ms when lobby auto-closes after 240s
  createdAt?: number;
  hints: HintItem[];
  chatMessages: ChatMessage[];
  answerSubmissionCount: number;
  totalEligibleAnswers: number;
  skipDiscussionVotesCount?: number | undefined;
  skipDiscussionRequired?: number | undefined;
  skipDiscussionVoters?: string[] | undefined;
  speakerFloor?: {
    currentSpeakerSocketId: string | null;
    currentSpeakerName: string | null;
    speakerIndex: number;
    totalSpeakers: number;
    speakerDeadline: number | null; // epoch ms
    handsRaised: string[]; // array of socketIds
    isOpenFloor: boolean;
  } | undefined;
  lastResult?: {
    winnerTeam: "detectives" | "imposters" | "tie";
    banner: string;
    commonWord: string;
    imposterWord: string;
    imposterNames: string[];
    scores: { [socketId: string]: number };
  } | undefined;
}

// Private server-only game data
export interface PrivateRoundData {
  commonWord: string;
  imposterWord: string;
  imposterSocketIds: string[];
  answers: { [socketId: string]: string }; // player answers (suspect socketId or guess)
}
