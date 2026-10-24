import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import Redis from "ioredis";
import { RoomManager, Room } from "./game/roomManager";
import { Player, RoomSettings } from "./game/types";
import { sanitizeText } from "./security";
import { generateUniqueDetectiveName } from "./game/names";

let ioInstance: Server | null = null;

export function getSocketIO(): Server | null {
  return ioInstance;
}

export function setupSocketServer(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        // Dynamic origin reflection allows credentials: true in all browsers
        callback(null, origin || true);
      },
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingInterval: 25000,
    pingTimeout: 20000,
    maxHttpBufferSize: 1e6, // 1MB for drawings
  });

  ioInstance = io;

  // Redis Adapter Setup for 10k CCU Scaling (Graceful Fallback)
  const REDIS_URL = process.env.REDIS_URL;
  if (REDIS_URL && REDIS_URL.trim() !== "") {
    try {
      console.log(`[Socket] Connecting to Redis for distributed clustering: ${REDIS_URL}`);
      const pubClient = new Redis(REDIS_URL);
      const subClient = pubClient.duplicate();

      pubClient.on("connect", () => {
        console.log("[Socket] Redis PubClient connected for distributed adapter.");
      });
      pubClient.on("error", (err) => {
        console.warn("[Socket] Redis error (continuing with local adapter):", err.message);
      });

      io.adapter(createAdapter(pubClient, subClient));
    } catch (err: any) {
      console.warn("[Socket] Failed to initialize Redis adapter:", err.message);
    }
  } else {
    console.log("[Socket] Running with high-performance in-memory Socket.IO adapter (single instance). Set REDIS_URL to enable multi-instance clustering.");
  }

  const roomManager = RoomManager.getInstance();
  roomManager.setIO(io);

  io.on("connection", (socket: Socket) => {
    let currentRoomCode: string | null = null;
    let currentPlayer: Player | null = null;

    let lastChatTimestamp = 0;
    let lastActionTimestamp = 0;

    // 1. Create Room
    socket.on(
      "room:create",
      ({ user, settings }: { user: { id: string; displayName: string; avatarUrl?: string }; settings?: Partial<RoomSettings> }, callback) => {
        try {
          const now = Date.now();
          if (now - lastActionTimestamp < 500) {
            if (callback) callback({ success: false, error: "Please wait before creating another room." });
            return;
          }
          lastActionTimestamp = now;

          let hostName = (user?.displayName || "").trim();
          if (!hostName || hostName.toLowerCase() === "detective" || hostName.toLowerCase() === "host") {
            hostName = generateUniqueDetectiveName();
          } else {
            hostName = sanitizeText(hostName, 25);
          }

          const hostPlayer: Player = {
            socketId: socket.id,
            userId: user?.id || socket.id,
            displayName: hostName,
            avatarUrl: user?.avatarUrl || "",
            isHost: true,
            score: 0,
            isConnected: true,
          };

          const room = roomManager.createRoom(hostPlayer, settings);
          currentRoomCode = room.code;
          currentPlayer = hostPlayer;

          socket.join(room.code);
          const publicState = room.getPublicState();
          socket.emit("room:state", publicState);
          room.broadcastState(io);
          io.emit("rooms:public-updated", roomManager.getPublicRooms());

          if (callback) {
            callback({ success: true, roomCode: room.code, roomState: publicState });
          }
        } catch (err: any) {
          if (callback) callback({ success: false, error: err.message });
        }
      }
    );

    // 2. Join Room
    socket.on(
      "room:join",
      ({ roomCode, user }: { roomCode: string; user: { id: string; displayName: string; avatarUrl?: string } }, callback) => {
        try {
          const now = Date.now();
          if (now - lastActionTimestamp < 50) {
            if (callback) callback({ success: false, error: "Please wait a moment." });
            return;
          }
          lastActionTimestamp = now;

          if (!roomCode || typeof roomCode !== "string" || !/^[A-Z0-9]{4,8}$/i.test(roomCode.trim())) {
            if (callback) callback({ success: false, error: "Invalid classroom room code." });
            return;
          }

          const cleanCode = roomCode.trim().toUpperCase();
          const room = roomManager.getRoom(cleanCode);
          if (!room) {
            if (callback) callback({ success: false, error: "Room not found." });
            return;
          }

          // 1. Check if a player with this userId or socketId is already in the room:
          let existingPlayer = Array.from(room.players.values()).find(
            (p) => (user.id && p.userId === user.id) || p.socketId === socket.id
          );

          // 2. If not found by userId, check if there is a disconnected player with the exact same non-default name:
          if (!existingPlayer && user.displayName && user.displayName.trim() && user.displayName.trim().toLowerCase() !== "detective") {
            const matchingDisconnected = Array.from(room.players.values()).find(
              (p) => !p.isConnected && p.displayName.toLowerCase() === user.displayName.trim().toLowerCase()
            );
            if (matchingDisconnected) {
              existingPlayer = matchingDisconnected;
            }
          }

          if (existingPlayer) {
            // Reconnecting player cleanly within grace window
            room.cancelDisconnectTimeout(existingPlayer.userId);
            delete existingPlayer.disconnectDeadline;
            const oldSocketId = existingPlayer.socketId;

            // If the socket ID changed (e.g. page reload or reconnect), remove old socket entry:
            if (oldSocketId !== socket.id) {
              const oldSock = io.sockets.sockets.get(oldSocketId);
              if (oldSock) {
                oldSock.leave(room.code);
              }
              room.players.delete(oldSocketId);
            }

            existingPlayer.socketId = socket.id;
            existingPlayer.isConnected = true;
            if (user.id) existingPlayer.userId = user.id;
            if (user.displayName && user.displayName.trim() && user.displayName.trim().toLowerCase() !== "detective") {
              existingPlayer.displayName = sanitizeText(user.displayName.trim(), 25);
            }
            room.players.set(socket.id, existingPlayer);

            // Re-sync imposter assignment and submitted answer keys if active match
            const imposterIndex = room.privateData.imposterSocketIds.indexOf(oldSocketId);
            if (imposterIndex !== -1) {
              room.privateData.imposterSocketIds[imposterIndex] = socket.id;
            }
            if (room.privateData.answers[oldSocketId]) {
              room.privateData.answers[socket.id] = room.privateData.answers[oldSocketId];
              delete room.privateData.answers[oldSocketId];
            }

            currentRoomCode = room.code;
            currentPlayer = existingPlayer;

            socket.join(room.code);
            const publicState = room.getPublicState();
            socket.emit("room:state", publicState);
            room.broadcastState(io);

            // Re-emit secret word and role if game in progress
            if (room.phase !== "lobby" && room.phase !== "game_over") {
              const isImposter = room.privateData.imposterSocketIds.includes(socket.id);
              const secretWord = isImposter ? room.privateData.imposterWord : room.privateData.commonWord;
              const role = isImposter ? "imposter" : "detective";
              socket.emit("game:secret-word", {
                word: secretWord,
                role,
                round: room.currentRound,
                totalRounds: room.settings.rounds,
                category: room.settings.category,
              });
            }

            room.addChatMessage(io, {
              playerId: "system",
              playerName: "System",
              content: `⚡ ${existingPlayer.displayName} rejoined the classroom!`,
              isSystem: true,
            });

            if (callback) callback({ success: true, roomCode: room.code, roomState: publicState });
            return;
          }

          if (room.players.size >= room.settings.capacity) {
            if (callback) callback({ success: false, error: "Room is full." });
            return;
          }

          if (room.phase !== "lobby") {
            if (callback) callback({ success: false, error: "Game has already started in this room." });
            return;
          }

          let joinName = (user.displayName || "").trim();

          // Before assigning a name, if there is a disconnected ghost with the exact same name, purge it:
          if (joinName && joinName.toLowerCase() !== "detective") {
            const staleGhost = Array.from(room.players.values()).find(
              (p) => !p.isConnected && p.displayName.toLowerCase() === joinName.toLowerCase()
            );
            if (staleGhost) {
              room.removePlayer(io, staleGhost.socketId);
            }
          }

          const existingNames = Array.from(room.players.values())
            .filter((p) => p.socketId !== socket.id)
            .map((p) => p.displayName);

          if (!joinName || joinName.toLowerCase() === "detective" || existingNames.includes(joinName)) {
            joinName = generateUniqueDetectiveName(existingNames);
          } else {
            joinName = sanitizeText(joinName, 25);
          }

          const newPlayer: Player = {
            socketId: socket.id,
            userId: user.id || socket.id,
            displayName: joinName,
            avatarUrl: user.avatarUrl || "",
            isHost: false,
            score: 0,
            isConnected: true,
          };

          room.players.set(socket.id, newPlayer);
          currentRoomCode = room.code;
          currentPlayer = newPlayer;

          socket.join(room.code);
          const publicState = room.getPublicState();
          socket.emit("room:state", publicState);
          room.broadcastState(io);
          io.emit("rooms:public-updated", roomManager.getPublicRooms());

          room.addChatMessage(io, {
            playerId: "system",
            playerName: "System",
            content: `${newPlayer.displayName} joined the classroom!`,
            isSystem: true,
          });

          if (callback) callback({ success: true, roomCode: room.code, roomState: publicState });
        } catch (err: any) {
          if (callback) callback({ success: false, error: err.message });
        }
      }
    );

    // Instant Matchmaking (Find available public room or create one)
    socket.on(
      "room:instant-match",
      ({ user }: { user: { id: string; displayName: string; avatarUrl?: string } }, callback) => {
        try {
          const openRoom = roomManager.findOpenPublicRoom(user.id);
          if (openRoom) {
            const alreadyIn = Array.from(openRoom.players.values()).some(
              (p) => user.id && p.userId === user.id
            );
            if (!alreadyIn) {
              let matchName = (user.displayName || "").trim();
              const existingNames = Array.from(openRoom.players.values()).map((p) => p.displayName);
              if (!matchName || matchName.toLowerCase() === "detective" || existingNames.includes(matchName)) {
                matchName = generateUniqueDetectiveName(existingNames);
              } else {
                matchName = sanitizeText(matchName, 25);
              }

              const newPlayer: Player = {
                socketId: socket.id,
                userId: user.id || socket.id,
                displayName: matchName,
                avatarUrl: user.avatarUrl || "",
                isHost: false,
                score: 0,
                isConnected: true,
              };

              openRoom.players.set(socket.id, newPlayer);
              currentRoomCode = openRoom.code;
              currentPlayer = newPlayer;

              socket.join(openRoom.code);
              const publicState = openRoom.getPublicState();
              socket.emit("room:state", publicState);
              openRoom.broadcastState(io);
              io.emit("rooms:public-updated", roomManager.getPublicRooms());

              openRoom.addChatMessage(io, {
                playerId: "system",
                playerName: "System",
                content: `${newPlayer.displayName} joined via Instant Match! ⚡`,
                isSystem: true,
              });

              if (callback) callback({ success: true, roomCode: openRoom.code, roomState: publicState });
              return;
            }
          }
          // No open public room found -> create new public room
            const hostPlayer: Player = {
              socketId: socket.id,
              userId: user.id || socket.id,
              displayName: user.displayName || "Host",
              avatarUrl: user.avatarUrl || "",
              isHost: true,
              score: 0,
              isConnected: true,
            };

            const room = roomManager.createRoom(hostPlayer, { isPublic: true });
            currentRoomCode = room.code;
            currentPlayer = hostPlayer;

            socket.join(room.code);
            const publicState = room.getPublicState();
            socket.emit("room:state", publicState);
            room.broadcastState(io);
            io.emit("rooms:public-updated", roomManager.getPublicRooms());

            if (callback) callback({ success: true, roomCode: room.code, roomState: publicState });
        } catch (err: any) {
          if (callback) callback({ success: false, error: err.message });
        }
      }
    );

    // 2b. High-Speed Player Profile Sync (< 1ms In-Memory Update)
    socket.on(
      "player:update",
      ({ displayName, avatarUrl }: { displayName?: string; avatarUrl?: string }, callback) => {
        if (!currentRoomCode) {
          if (callback) callback({ success: false, error: "Not currently in a room." });
          return;
        }
        const room = roomManager.getRoom(currentRoomCode);
        if (!room) {
          if (callback) callback({ success: false, error: "Room not found." });
          return;
        }
        const player = room.players.get(socket.id);
        if (!player) {
          if (callback) callback({ success: false, error: "Player not found in room." });
          return;
        }

        if (displayName && typeof displayName === "string" && displayName.trim()) {
          player.displayName = sanitizeText(displayName.trim(), 25);
        }
        if (avatarUrl && typeof avatarUrl === "string") {
          player.avatarUrl = avatarUrl;
        }

        room.broadcastState(io);
        if (callback) callback({ success: true, roomState: room.getPublicState() });
      }
    );

    // 3. Update Room Settings (Host only in lobby)
    socket.on("room:update-settings", ({ settings }: { settings: Partial<RoomSettings> }, callback) => {
      if (!currentRoomCode) return;
      const room = roomManager.getRoom(currentRoomCode);
      if (!room) return;

      const caller = room.players.get(socket.id);
      if (!caller?.isHost || room.phase !== "lobby") {
        if (callback) callback({ success: false, error: "Cannot change settings right now." });
        return;
      }

      room.settings = { ...room.settings, ...settings };
      room.broadcastState(io);
      if (callback) callback({ success: true });
    });

    // 4. Start Game (Host only, min 3 players)
    socket.on("room:start", async (_, callback) => {
      if (!currentRoomCode) return;
      const room = roomManager.getRoom(currentRoomCode);
      if (!room) return;

      const caller = room.players.get(socket.id);
      if (!caller?.isHost) {
        if (callback) callback({ success: false, error: "Only the host can start the game." });
        return;
      }

      try {
        await room.startGame(io);
        io.emit("rooms:public-updated", roomManager.getPublicRooms());
        if (callback) callback({ success: true });
      } catch (err: any) {
        if (callback) callback({ success: false, error: err.message });
      }
    });

    // 5. Submit Hint (Active player only)
    socket.on(
      "game:submit-hint",
      (
        {
          type,
          content,
          transcript,
        }: {
          type: "text" | "drawing" | "voice";
          content: string;
          transcript?: string;
        },
        callback
      ) => {
        if (!currentRoomCode) return;
        const room = roomManager.getRoom(currentRoomCode);
        if (!room) return;

        try {
          room.submitHint(io, socket.id, type, content, transcript);
          if (callback) callback({ success: true });
        } catch (err: any) {
          if (callback) callback({ success: false, error: err.message });
        }
      }
    );

    // 6. Submit Secret Answer (Skribbl style)
    socket.on("game:submit-answer", ({ suspectSocketId }: { suspectSocketId: string }, callback) => {
      if (!currentRoomCode) return;
      const room = roomManager.getRoom(currentRoomCode);
      if (!room) return;

      try {
        room.submitAnswer(io, socket.id, suspectSocketId);
        if (callback) callback({ success: true });
      } catch (err: any) {
        if (callback) callback({ success: false, error: err.message });
      }
    });

    // 6b. Vote to Skip Discussion (Majority Rule)
    socket.on("game:vote-skip-discussion", (_, callback) => {
      if (!currentRoomCode) return;
      const room = roomManager.getRoom(currentRoomCode);
      if (!room) return;

      try {
        const result = room.voteSkipDiscussion(io, socket.id);
        if (callback) callback(result);
      } catch (err: any) {
        if (callback) callback({ success: false, error: err.message });
      }
    });

    // Pass Speaker Floor ("Done / Pass Mic")
    socket.on("game:pass-speaker-floor", (_, callback) => {
      if (!currentRoomCode) return;
      const room = roomManager.getRoom(currentRoomCode);
      if (!room) return;

      try {
        const result = room.passSpeakerFloor(io, socket.id);
        if (callback) callback(result);
      } catch (err: any) {
        if (callback) callback({ success: false, error: err.message });
      }
    });

    // Toggle Raise Hand ("Objection / Want to Speak")
    socket.on("game:raise-hand", (_, callback) => {
      if (!currentRoomCode) return;
      const room = roomManager.getRoom(currentRoomCode);
      if (!room) return;

      try {
        const result = room.toggleRaiseHand(io, socket.id);
        if (callback) callback(result);
      } catch (err: any) {
        if (callback) callback({ success: false, error: err.message });
      }
    });

    // WebRTC Live Voice Signaling
    socket.on("voice:signal", ({ to, signal, type }: { to: string; signal: any; type: string }) => {
      if (to && currentRoomCode) {
        io.to(to).emit("voice:signal", { from: socket.id, signal, type });
      }
    });

    // Voice speaking activity detection broadcast (for live wave rings around player avatars)
    socket.on("voice:speaking", ({ isSpeaking }: { isSpeaking: boolean }) => {
      if (currentRoomCode) {
        socket.to(currentRoomCode).emit("voice:speaking", { socketId: socket.id, isSpeaking });
      }
    });

    // Voice mic mute state
    socket.on("voice:state-change", ({ isMuted }: { isMuted: boolean }) => {
      if (currentRoomCode) {
        socket.to(currentRoomCode).emit("voice:state-change", { socketId: socket.id, isMuted });
      }
    });

    // 7. Next Round
    socket.on("game:next-round", async (_, callback) => {
      if (!currentRoomCode) return;
      const room = roomManager.getRoom(currentRoomCode);
      if (!room) return;

      const caller = room.players.get(socket.id);
      if (!caller?.isHost) {
        if (callback) callback({ success: false, error: "Only host can advance round." });
        return;
      }

      try {
        await room.startNextRound(io);
        if (callback) callback({ success: true });
      } catch (err: any) {
        if (callback) callback({ success: false, error: err.message });
      }
    });

    // 8. Chat Message (Rate limited & XSS sanitized)
    socket.on("chat:send", ({ content }: { content: string }) => {
      if (!currentRoomCode || !currentPlayer) return;
      const room = roomManager.getRoom(currentRoomCode);
      if (!room) return;

      const now = Date.now();
      if (now - lastChatTimestamp < 600) {
        return; // drop spam messages silently
      }
      lastChatTimestamp = now;

      const cleanContent = sanitizeText(content, 150);
      if (!cleanContent) return;

      room.addChatMessage(io, {
        playerId: socket.id,
        playerName: currentPlayer.displayName,
        content: cleanContent,
        isSystem: false,
      });
    });

    // 9. Leave Room (explicit intent by player clicking Leave)
    socket.on("room:leave", (_, callback) => {
      handleExplicitLeave();
      if (callback) callback({ success: true });
    });

    // 10. Disconnect (accidental drop, page refresh, mobile screen lock)
    socket.on("disconnect", () => {
      handleDisconnect();
    });

    function handleExplicitLeave() {
      if (!currentRoomCode) return;
      const room = roomManager.getRoom(currentRoomCode);
      if (!room) return;

      socket.leave(room.code);
      const targetUserId = currentPlayer?.userId;
      const { remainingCount } = room.removePlayer(io, socket.id);

      // Clean up any other slot registered under the same user ID:
      if (targetUserId) {
        const duplicate = Array.from(room.players.values()).find((p) => p.userId === targetUserId);
        if (duplicate) {
          room.removePlayer(io, duplicate.socketId);
        }
      }

      if (remainingCount === 0 || room.players.size === 0) {
        roomManager.removeRoom(room.code);
      } else {
        room.broadcastState(io);
      }
      io.emit("rooms:public-updated", roomManager.getPublicRooms());

      currentRoomCode = null;
      currentPlayer = null;
    }

    function handleDisconnect() {
      if (!currentRoomCode) return;
      const room = roomManager.getRoom(currentRoomCode);
      if (!room) return;

      socket.leave(room.code);
      // Initiate 30-second reconnection grace period!
      const { remainingCount } = room.handlePlayerDisconnect(io, socket.id);

      if (remainingCount === 0) {
        roomManager.removeRoom(room.code);
      }
      io.emit("rooms:public-updated", roomManager.getPublicRooms());

      currentRoomCode = null;
      currentPlayer = null;
    }
  });

  return io;
}
