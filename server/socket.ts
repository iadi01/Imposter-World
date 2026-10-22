import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import Redis from "ioredis";
import { RoomManager, Room } from "./game/roomManager";
import { Player, RoomSettings } from "./game/types";
import { sanitizeText } from "./security";

let ioInstance: Server | null = null;

export function getSocketIO(): Server | null {
  return ioInstance;
}

export function setupSocketServer(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
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

          const hostPlayer: Player = {
            socketId: socket.id,
            userId: user?.id || socket.id,
            displayName: sanitizeText(user?.displayName || "Host", 25),
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
          if (now - lastActionTimestamp < 300) {
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

          // Anti-duplicate / Multi-tab self join check:
          // Check if a player with this userId is already in the room
          const existingPlayer = Array.from(room.players.values()).find(
            (p) => (user.id && p.userId === user.id) || p.socketId === socket.id
          );

          if (existingPlayer) {
            // If already connected on another active socket, block duplicate self-joining!
            if (existingPlayer.isConnected && existingPlayer.socketId !== socket.id) {
              if (callback) {
                callback({
                  success: false,
                  error: "You are already active in this room in another tab! Duplicate joins from the same account are blocked.",
                });
              }
              return;
            }

            // Reconnecting disconnected player cleanly
            const oldSocketId = existingPlayer.socketId;
            room.players.delete(oldSocketId);
            existingPlayer.socketId = socket.id;
            existingPlayer.isConnected = true;
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

          const newPlayer: Player = {
            socketId: socket.id,
            userId: user.id || socket.id,
            displayName: user.displayName || `Player_${room.players.size + 1}`,
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
              const newPlayer: Player = {
                socketId: socket.id,
                userId: user.id || socket.id,
                displayName: user.displayName || `Player_${openRoom.players.size + 1}`,
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

    // 9. Leave Room
    socket.on("room:leave", () => {
      handleLeave();
    });

    // 10. Disconnect
    socket.on("disconnect", () => {
      handleLeave();
    });

    function handleLeave() {
      if (!currentRoomCode) return;
      const room = roomManager.getRoom(currentRoomCode);
      if (!room) return;

      socket.leave(room.code);
      const { remainingCount } = room.removePlayer(io, socket.id);

      if (remainingCount === 0) {
        roomManager.removeRoom(room.code);
      } else {
        room.broadcastState(io);
      }
      io.emit("rooms:public-updated", roomManager.getPublicRooms());

      currentRoomCode = null;
      currentPlayer = null;
    }
  });

  return io;
}
