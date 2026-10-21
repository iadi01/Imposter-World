import { Server } from "socket.io";
import mongoose from "mongoose";
import crypto from "crypto";
import { getRandomWordPair } from "./words";
import {
  ChatMessage,
  GamePhase,
  HintItem,
  Player,
  PrivateRoundData,
  PublicRoomState,
  RoomSettings,
} from "./types";
import { Match } from "../models/Match";
import { User } from "../models/User";

export class Room {
  public code: string;
  public settings: RoomSettings;
  public phase: GamePhase = "lobby";
  public players: Map<string, Player> = new Map();
  public currentRound: number = 0;
  public activePlayerIndex: number = 0;
  public hints: HintItem[] = [];
  public chatMessages: ChatMessage[] = [];
  public phaseDeadline: number | null = null;
  public timer: NodeJS.Timeout | null = null;
  public lastResult: PublicRoomState["lastResult"];
  public skipDiscussionVotes: Set<string> = new Set();

  // Protected private state — never sent to public clients!
  public privateData: PrivateRoundData = {
    commonWord: "",
    imposterWord: "",
    imposterSocketIds: [],
    answers: {},
  };

  constructor(code: string, host: Player, settings?: Partial<RoomSettings>) {
    this.code = code;
    this.settings = {
      name: `${host.displayName}'s Room`,
      capacity: 8,
      language: "English",
      drawTime: 80,
      rounds: 3,
      gameMode: "normal",
      wordCount: 1,
      hintsCount: 1,
      discussionTime: 120,
      answerTime: 120,
      isPublic: true,
      ...settings,
    };
    this.players.set(host.socketId, host);
  }

  public getPlayerList(): Player[] {
    return Array.from(this.players.values());
  }

  public getPublicState(): PublicRoomState {
    const playerArray = this.getPlayerList();
    const activePlayer =
      this.phase === "hint_turn" && playerArray[this.activePlayerIndex]
        ? playerArray[this.activePlayerIndex]
        : null;

    const connectedCount = playerArray.filter((p) => p.isConnected).length;
    const requiredSkipVotes = Math.floor(Math.max(1, connectedCount) / 2) + 1;

    return {
      roomCode: this.code,
      phase: this.phase,
      currentRound: this.currentRound,
      totalRounds: this.settings.rounds,
      settings: this.settings,
      players: playerArray.map((p) => ({
        socketId: p.socketId,
        userId: p.userId,
        displayName: p.displayName,
        avatarUrl: p.avatarUrl,
        isHost: p.isHost,
        score: p.score,
        isConnected: p.isConnected,
        hasSubmittedAnswer: Boolean(this.privateData.answers[p.socketId]),
      })),
      activePlayerSocketId: activePlayer ? activePlayer.socketId : null,
      activePlayerName: activePlayer ? activePlayer.displayName : null,
      phaseDeadline: this.phaseDeadline,
      hints: this.hints,
      chatMessages: this.chatMessages,
      answerSubmissionCount: Object.keys(this.privateData.answers).length,
      totalEligibleAnswers: connectedCount,
      skipDiscussionVotesCount: this.skipDiscussionVotes ? this.skipDiscussionVotes.size : 0,
      skipDiscussionRequired: requiredSkipVotes,
      skipDiscussionVoters: this.skipDiscussionVotes ? Array.from(this.skipDiscussionVotes) : [],
      lastResult: this.lastResult,
    };
  }

  public clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  // --- PLAYER REMOVAL & AUTOMATIC HOST / CREATOR OWNERSHIP TRANSFER ---
  public removePlayer(
    io: Server,
    socketId: string
  ): { remainingCount: number; newHost: Player | null } {
    const player = this.players.get(socketId);
    if (!player) {
      return { remainingCount: this.players.size, newHost: null };
    }

    const wasHost = player.isHost;
    this.players.delete(socketId);
    this.skipDiscussionVotes?.delete(socketId);
    delete this.privateData.answers[socketId];

    this.addChatMessage(io, {
      playerId: "system",
      playerName: "System",
      content: `${player.displayName} left the classroom.`,
      isSystem: true,
    });

    let newHost: Player | null = null;

    // If room creator / host left, transfer ownership to the next connected player!
    if (wasHost && this.players.size > 0) {
      const remainingPlayers = this.getPlayerList();
      newHost = remainingPlayers.find((p) => p.isConnected) || remainingPlayers[0] || null;

      if (newHost) {
        // Ensure only the new host has isHost = true
        for (const p of this.players.values()) {
          p.isHost = p.socketId === newHost.socketId;
        }

        this.settings.name = `${newHost.displayName}'s Room`;

        this.addChatMessage(io, {
          playerId: "system",
          playerName: "System",
          content: `👑 Room creator left. Ownership shifted to ${newHost.displayName}!`,
          isSystem: true,
        });

        // Send dedicated notification to the newly promoted host
        io.to(newHost.socketId).emit("classroom:announcement", {
          message: "You are now the room creator & host! You can control game settings and start rounds.",
          from: "Classroom System",
        });
      }
    }

    // Mid-game safety handlers:
    if (this.players.size > 0 && this.phase !== "lobby") {
      // 1. If in hint_turn and active player left:
      if (this.phase === "hint_turn") {
        const remaining = this.getPlayerList();
        if (this.activePlayerIndex >= remaining.length) {
          // If all remaining players gave hints, transition to discussion
          this.clearTimer();
          this.startDiscussionPhase(io);
        } else {
          // If active player left, trigger turn for the current index
          const active = remaining[this.activePlayerIndex];
          if (!active || active.socketId === socketId) {
            this.clearTimer();
            this.startHintTurn(io);
          }
        }
      }

      // 2. If in discussion phase, check if remaining votes meet majority:
      if (this.phase === "discussion") {
        const connectedCount = this.getPlayerList().filter((p) => p.isConnected).length;
        const requiredVotes = Math.floor(Math.max(1, connectedCount) / 2) + 1;
        if (this.skipDiscussionVotes.size >= requiredVotes) {
          this.addChatMessage(io, {
            playerId: "system",
            playerName: "System",
            content: `📢 Majority voted to skip discussion! Moving to secret vote...`,
            isSystem: true,
          });
          this.clearTimer();
          this.startAnswerPhase(io);
        }
      }

      // 3. If in answer_submission and remaining connected players have all submitted:
      if (this.phase === "answer_submission") {
        const connectedCount = this.getPlayerList().filter((p) => p.isConnected).length;
        if (Object.keys(this.privateData.answers).length >= connectedCount) {
          this.clearTimer();
          this.calculateResults(io);
        }
      }
    }

    return { remainingCount: this.players.size, newHost };
  }

  public addChatMessage(io: Server, msg: Omit<ChatMessage, "id" | "timestamp">) {
    const fullMsg: ChatMessage = {
      ...msg,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
    };
    this.chatMessages.push(fullMsg);
    if (this.chatMessages.length > 100) {
      this.chatMessages.shift();
    }
    io.to(this.code).emit("chat:new-message", fullMsg);
  }

  // --- GAME START ---
  public async startGame(io: Server) {
    if (this.players.size < 3) {
      throw new Error("At least 3 players are required to start.");
    }
    this.currentRound = 1;
    this.getPlayerList().forEach((p) => (p.score = 0));
    await this.startRound(io);
  }

  public async startNextRound(io: Server) {
    if (this.currentRound >= this.settings.rounds) {
      this.phase = "game_over";
      this.broadcastState(io);
      return;
    }
    this.currentRound += 1;
    await this.startRound(io);
  }

  // --- ROUND LIFECYCLE ---
  private async startRound(io: Server) {
    this.clearTimer();
    this.hints = [];
    this.privateData.answers = {};
    this.lastResult = undefined;

    // 1. Pick secret word pair
    const pair = await getRandomWordPair({
      category: this.settings.category,
      language: this.settings.language,
      difficulty: this.settings.difficulty,
    });
    this.privateData.commonWord = pair.common;
    this.privateData.imposterWord = pair.imposter;

    // 2. Select Imposters
    const playerArray = this.getPlayerList().filter((p) => p.isConnected);
    let imposterCount = 1;
    if (this.settings.gameMode === "double_imposter" && playerArray.length >= 5) {
      imposterCount = 2;
    }

    // Shuffle indices securely
    const shuffled = [...playerArray].sort(() => Math.random() - 0.5);
    this.privateData.imposterSocketIds = shuffled.slice(0, imposterCount).map((p) => p.socketId);

    // 3. Send PRIVATE word assignments to each individual socket (ZERO LEAK!)
    for (const player of playerArray) {
      const isImposter = this.privateData.imposterSocketIds.includes(player.socketId);
      const secretWord = isImposter ? this.privateData.imposterWord : this.privateData.commonWord;
      const role = isImposter ? "imposter" : "detective";

      io.to(player.socketId).emit("game:secret-word", {
        word: secretWord,
        role,
        round: this.currentRound,
        totalRounds: this.settings.rounds,
      });
    }

    // 4. Begin sequential hint turns
    this.activePlayerIndex = 0;
    this.startHintTurn(io);
  }

  // --- HINT TURN PHASE ---
  public startHintTurn(io: Server) {
    this.clearTimer();
    const playerArray = this.getPlayerList();

    if (this.activePlayerIndex >= playerArray.length) {
      // All hints completed, move to discussion!
      this.startDiscussionPhase(io);
      return;
    }

    const activePlayer = playerArray[this.activePlayerIndex];
    if (!activePlayer) {
      this.startDiscussionPhase(io);
      return;
    }
    if (!activePlayer.isConnected) {
      // Skip disconnected player
      this.activePlayerIndex++;
      this.startHintTurn(io);
      return;
    }

    this.phase = "hint_turn";
    const duration = this.settings.drawTime;
    this.phaseDeadline = Date.now() + duration * 1000;

    this.broadcastState(io);

    // Broadcast system chat notification
    this.addChatMessage(io, {
      playerId: "system",
      playerName: "System",
      content: `It is ${activePlayer.displayName}'s turn to give a clue! (${duration}s)`,
      isSystem: true,
    });

    // Auto-advance if timer expires
    this.timer = setTimeout(() => {
      this.addChatMessage(io, {
        playerId: "system",
        playerName: "System",
        content: `${activePlayer.displayName} ran out of time.`,
        isSystem: true,
      });
      this.activePlayerIndex++;
      this.startHintTurn(io);
    }, duration * 1000);
  }

  public submitHint(
    io: Server,
    socketId: string,
    type: "text" | "drawing" | "voice",
    content: string,
    transcript?: string
  ) {
    const playerArray = this.getPlayerList();
    const activePlayer = playerArray[this.activePlayerIndex];

    if (!activePlayer || activePlayer.socketId !== socketId) {
      throw new Error("It is not your turn to submit a clue.");
    }

    this.clearTimer();
    this.hints.push({
      playerId: activePlayer.socketId,
      playerName: activePlayer.displayName,
      type,
      content,
      transcript,
      timestamp: Date.now(),
    });

    this.addChatMessage(io, {
      playerId: activePlayer.socketId,
      playerName: activePlayer.displayName,
      content:
        type === "text"
          ? `Clue: "${content}"`
          : type === "voice"
          ? `[Voice Clue Shared] 🎙️ ${transcript ? `"${transcript}"` : ""}`
          : `[Drawing Shared] 🎨`,
      isSystem: false,
    });

    this.activePlayerIndex++;
    this.startHintTurn(io);
  }

  // --- DISCUSSION PHASE (120s) ---
  public startDiscussionPhase(io: Server) {
    this.clearTimer();
    this.phase = "discussion";
    this.skipDiscussionVotes.clear();
    const duration = this.settings.discussionTime || 120;
    this.phaseDeadline = Date.now() + duration * 1000;

    this.broadcastState(io);

    this.addChatMessage(io, {
      playerId: "system",
      playerName: "System",
      content: `Discussion Time! Debate clues for ${duration}s to find the imposter, or vote to skip.`,
      isSystem: true,
    });

    this.timer = setTimeout(() => {
      this.startAnswerPhase(io);
    }, duration * 1000);
  }

  // --- VOTE TO SKIP DISCUSSION (Majority Rule) ---
  public voteSkipDiscussion(
    io: Server,
    socketId: string
  ): { success: boolean; error?: string; skipped?: boolean } {
    if (this.phase !== "discussion") {
      return { success: false, error: "Discussion phase is not currently active." };
    }
    const player = this.players.get(socketId);
    if (!player) {
      return { success: false, error: "Player not found." };
    }

    this.skipDiscussionVotes.add(socketId);

    const connectedPlayers = this.getPlayerList().filter((p) => p.isConnected);
    const totalConnected = Math.max(1, connectedPlayers.length);
    const requiredVotes = Math.floor(totalConnected / 2) + 1;

    this.addChatMessage(io, {
      playerId: "system",
      playerName: "System",
      content: `⏩ ${player.displayName} voted to skip discussion (${this.skipDiscussionVotes.size}/${requiredVotes})`,
      isSystem: true,
    });

    if (this.skipDiscussionVotes.size >= requiredVotes) {
      this.addChatMessage(io, {
        playerId: "system",
        playerName: "System",
        content: `📢 Majority voted to skip discussion! Moving to secret vote...`,
        isSystem: true,
      });
      this.clearTimer();
      this.startAnswerPhase(io);
      return { success: true, skipped: true };
    }

    this.broadcastState(io);
    return { success: true, skipped: false };
  }

  // --- SECRET ANSWER PHASE (120s - Skribbl Privacy) ---
  public startAnswerPhase(io: Server) {
    this.clearTimer();
    this.phase = "answer_submission";
    this.skipDiscussionVotes.clear();
    this.privateData.answers = {};
    const duration = this.settings.answerTime || 120;
    this.phaseDeadline = Date.now() + duration * 1000;

    this.broadcastState(io);

    this.addChatMessage(io, {
      playerId: "system",
      playerName: "System",
      content: `Secret Answer Time! Who do you think is the Imposter? Submit privately.`,
      isSystem: true,
    });

    this.timer = setTimeout(() => {
      this.calculateResults(io);
    }, duration * 1000);
  }

  public submitAnswer(io: Server, socketId: string, suspectSocketId: string) {
    if (this.phase !== "answer_submission") {
      throw new Error("Answers can only be submitted during the Answer Phase.");
    }

    this.privateData.answers[socketId] = suspectSocketId;

    // Send confirmation ONLY to the submitter (Skribbl style)
    io.to(socketId).emit("game:answer-confirmed", {
      suspectSocketId,
    });

    // Broadcast only updated submission count to room
    this.broadcastState(io);

    // If all connected players have submitted, immediately transition to results!
    const connectedCount = this.getPlayerList().filter((p) => p.isConnected).length;
    if (Object.keys(this.privateData.answers).length >= connectedCount) {
      this.clearTimer();
      this.calculateResults(io);
    }
  }

  // --- RESULTS & SCORING ---
  public async calculateResults(io: Server) {
    this.clearTimer();
    this.phase = "results";
    this.phaseDeadline = null;

    const playerArray = this.getPlayerList();
    const imposterNames = playerArray
      .filter((p) => this.privateData.imposterSocketIds.includes(p.socketId))
      .map((p) => p.displayName);

    // Tally votes
    const voteCounts: { [suspectSocketId: string]: number } = {};
    for (const suspectId of Object.values(this.privateData.answers)) {
      voteCounts[suspectId] = (voteCounts[suspectId] || 0) + 1;
    }

    // Find top voted player
    let maxVotes = 0;
    let topSuspectId: string | null = null;
    let isTie = false;

    for (const [suspectId, count] of Object.entries(voteCounts)) {
      if (count > maxVotes) {
        maxVotes = count;
        topSuspectId = suspectId;
        isTie = false;
      } else if (count === maxVotes && maxVotes > 0) {
        isTie = true;
      }
    }

    const imposterCaught =
      !isTie && topSuspectId && this.privateData.imposterSocketIds.includes(topSuspectId);

    let winnerTeam: "detectives" | "imposters" | "tie" = "imposters";
    let banner = "";

    if (imposterCaught) {
      winnerTeam = "detectives";
      banner = "The Imposter failed the test! Players passed the test!";
      // Award detectives points
      for (const p of playerArray) {
        if (!this.privateData.imposterSocketIds.includes(p.socketId)) {
          p.score += 100;
        }
      }
    } else {
      winnerTeam = "imposters";
      const nameStr = imposterNames.length ? imposterNames.join(", ") : "The Imposter";
      banner = `${nameStr} passed the test! Players failed to identify the Imposter.`;
      // Award imposters points
      for (const p of playerArray) {
        if (this.privateData.imposterSocketIds.includes(p.socketId)) {
          p.score += 200;
        }
      }
    }

    const scoresMap: { [socketId: string]: number } = {};
    playerArray.forEach((p) => (scoresMap[p.socketId] = p.score));

    this.lastResult = {
      winnerTeam,
      banner,
      commonWord: this.privateData.commonWord,
      imposterWord: this.privateData.imposterWord,
      imposterNames,
      scores: scoresMap,
    };

    this.broadcastState(io);

    this.addChatMessage(io, {
      playerId: "system",
      playerName: "System",
      content: `Round Results: ${banner}`,
      isSystem: true,
    });

    // Save match to MongoDB & update player stats
    await this.persistMatchResults(winnerTeam, banner, imposterNames);
  }

  private async persistMatchResults(
    winnerTeam: "detectives" | "imposters" | "tie",
    banner: string,
    imposterNames: string[]
  ) {
    if (mongoose.connection.readyState !== 1) {
      return; // Database not connected in unit test or offline mode
    }
    try {
      const matchPlayers = this.getPlayerList().map((p) => {
        const isImposter = this.privateData.imposterSocketIds.includes(p.socketId);
        const won =
          winnerTeam === "detectives"
            ? !isImposter
            : winnerTeam === "imposters"
            ? isImposter
            : false;

        return {
          userId: p.userId,
          displayName: p.displayName,
          avatarUrl: p.avatarUrl,
          role: isImposter ? ("imposter" as const) : ("detective" as const),
          score: p.score,
          won,
        };
      });

      await Match.create({
        roomCode: this.code,
        mode: this.settings.gameMode,
        rounds: this.settings.rounds,
        players: matchPlayers,
        imposterNames,
        commonWord: this.privateData.commonWord,
        imposterWord: this.privateData.imposterWord,
        winnerTeam,
        resultBanner: banner,
        completedAt: new Date(),
      });

      // Update user stats in DB for both registered users and authenticated guests
      for (const p of matchPlayers) {
        try {
          let user: any = null;
          if (p.userId && mongoose.isValidObjectId(p.userId)) {
            user = await (User as any).findById(p.userId);
          }
          if (!user && p.displayName) {
            user = await (User as any).findOne({
              $or: [
                { displayName: p.displayName, isGuest: true },
                { email: `${p.userId}@imposterworld.local` },
              ],
            });
          }
          if (user) {
            await user.recalcStats(p.won, p.role === "imposter");
          }
        } catch (playerStatErr) {
          console.error(`[RoomManager] Error updating stats for player ${p.displayName}:`, playerStatErr);
        }
      }
    } catch (err) {
      console.error("[RoomManager] Failed to persist match in MongoDB:", err);
    }
  }

  public broadcastState(io: Server) {
    io.to(this.code).emit("room:state", this.getPublicState());
  }
}

// 32-character unambiguous charset (excludes 0, O, 1, I, L to avoid confusion)
const SECURE_CODE_CHARSET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

function generateCryptographicCode(length = 6): string {
  const bytes = crypto.randomBytes(length);
  let result = "";
  for (let i = 0; i < length; i++) {
    const byte = bytes[i];
    if (byte !== undefined) {
      result += SECURE_CODE_CHARSET[byte % SECURE_CODE_CHARSET.length];
    }
  }
  return result;
}

export class RoomManager {
  private static instance: RoomManager;
  private rooms: Map<string, Room> = new Map();
  private historicalCodes: Set<string> = new Set(); // Prevents collisions with previous rooms

  private constructor() {}

  public static getInstance(): RoomManager {
    if (!RoomManager.instance) {
      RoomManager.instance = new RoomManager();
    }
    return RoomManager.instance;
  }

  public createRoom(host: Player, settings?: Partial<RoomSettings>): Room {
    let code: string;
    let attempts = 0;
    do {
      code = generateCryptographicCode(6);
      attempts++;
      if (attempts > 50) {
        code = generateCryptographicCode(8); // High entropy fallback
      }
    } while (this.rooms.has(code) || this.historicalCodes.has(code));

    this.historicalCodes.add(code);
    // Keep set bounded to 50,000 recently used room codes
    if (this.historicalCodes.size > 50000) {
      const firstCode = this.historicalCodes.values().next().value;
      if (firstCode) this.historicalCodes.delete(firstCode);
    }

    const room = new Room(code, host, settings);
    this.rooms.set(code, room);
    console.log(`[RoomManager] Secure Collision-Proof Room created: #${code} by ${host.displayName}`);
    return room;
  }

  public getRoom(code: string): Room | undefined {
    return this.rooms.get(code.toUpperCase());
  }

  public removeRoom(code: string) {
    const room = this.rooms.get(code);
    if (room) {
      room.clearTimer();
      this.rooms.delete(code);
      console.log(`[RoomManager] Room destroyed: #${code}`);
    }
  }

  public findOpenPublicRoom(excludeUserId?: string): Room | undefined {
    return Array.from(this.rooms.values()).find(
      (r) =>
        r.settings.isPublic &&
        r.phase === "lobby" &&
        r.players.size < r.settings.capacity &&
        (!excludeUserId || !Array.from(r.players.values()).some((p) => p.userId === excludeUserId))
    );
  }

  public getPublicRooms(): PublicRoomState[] {
    return Array.from(this.rooms.values())
      .filter((r) => r.settings.isPublic && r.phase === "lobby")
      .map((r) => r.getPublicState());
  }

  public getAllRooms(): Room[] {
    return Array.from(this.rooms.values());
  }
}
