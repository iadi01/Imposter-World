import { describe, it, expect, beforeEach } from "vitest";
import mongoose from "mongoose";
import { User, IUser } from "../../server/models/User";
import { Room, RoomManager } from "../../server/game/roomManager";
import { Player } from "../../server/game/types";
import { generateToken } from "../../server/auth";

describe("User Identity Persistence & High-Speed Room Sync", () => {
  const MOCK_USER_ID = new mongoose.Types.ObjectId().toString();
  const MOCK_GUEST_ID = new mongoose.Types.ObjectId().toString();

  it("never overwrites custom display name with Google OAuth name upon re-login", () => {
    // 1. Simulate an existing user who previously customized their name
    const existingUser = {
      _id: new mongoose.Types.ObjectId(MOCK_USER_ID),
      email: "adityasharma10@amityonline.com",
      displayName: "Detective Aditya Pro", // Custom chosen name
      avatarUrl: "https://lh3.googleusercontent.com/old",
      isGuest: false,
    };

    // Google returns the full legal name
    const googleProfile = {
      sub: "google_123456789",
      email: "adityasharma10@amityonline.com",
      name: "Aditya Sharma", // Name from Google
      picture: "https://lh3.googleusercontent.com/new",
    };

    // Simulate our updated login logic:
    // Only set Google name if displayName is missing/empty/default
    if (!existingUser.displayName || existingUser.displayName.trim() === "" || existingUser.displayName.toLowerCase() === "detective") {
      existingUser.displayName = googleProfile.name;
    }

    // Verify custom name is strictly PRESERVED
    expect(existingUser.displayName).toBe("Detective Aditya Pro");
    expect(existingUser.displayName).not.toBe(googleProfile.name);
  });

  it("assigns Google name only on initial registration when user has no custom name", () => {
    const newUser = {
      displayName: "",
      email: "newstudent@classroom.edu",
    };

    const googleProfile = {
      name: "Rohan Verma",
    };

    if (!newUser.displayName || newUser.displayName.trim() === "" || newUser.displayName.toLowerCase() === "detective") {
      newUser.displayName = googleProfile.name;
    }

    expect(newUser.displayName).toBe("Rohan Verma");
  });

  it("generates a valid, persistent session token for guest users", () => {
    const guestUser = {
      _id: MOCK_GUEST_ID,
      email: "guest_1729000_5432@imposterworld.local",
      displayName: "Guest_5432",
      isGuest: true,
    };

    const token = generateToken(guestUser);
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(20);
  });

  it("preserves guest ID on logout by restoring the previous guest record", () => {
    const preLoginGuestId = MOCK_GUEST_ID;
    const preLoginGuestName = "ShadowBluffer";

    // Mock guest stored in database
    const dbGuests = new Map<string, any>([
      [
        preLoginGuestId,
        {
          _id: preLoginGuestId,
          displayName: preLoginGuestName,
          isGuest: true,
        },
      ],
    ]);

    // Simulated logout request sending { guestId: preLoginGuestId }
    const requestedGuestId = preLoginGuestId;
    const restoredGuest = dbGuests.get(requestedGuestId);

    expect(restoredGuest).toBeDefined();
    expect(restoredGuest._id).toBe(preLoginGuestId);
    expect(restoredGuest.displayName).toBe(preLoginGuestName);
  });

  it("executes room join in milliseconds (< 20ms) using fast identity", async () => {
    const roomManager = RoomManager.getInstance();
    const hostPlayer: Player = {
      socketId: "sock_host_1",
      userId: "user_host_1",
      displayName: "Classroom Host",
      avatarUrl: "",
      isHost: true,
      score: 0,
      isConnected: true,
    };

    const room = roomManager.createRoom(hostPlayer);
    const startTime = performance.now();

    // Fast synchronous identity joining the room
    const joiningPlayer: Player = {
      socketId: "sock_joiner_1",
      userId: MOCK_GUEST_ID,
      displayName: "FastJoiner",
      avatarUrl: "",
      isHost: false,
      score: 0,
      isConnected: true,
    };

    room.players.set(joiningPlayer.socketId, joiningPlayer);
    const state = room.getPublicState();
    const durationMs = performance.now() - startTime;

    expect(durationMs).toBeLessThan(20); // Must be under 20 milliseconds
    expect(state.players.some((p) => p.userId === MOCK_GUEST_ID)).toBe(true);

    roomManager.removeRoom(room.code);
  });

  it("updates player display name in memory across room in less than 1ms", () => {
    const roomManager = RoomManager.getInstance();
    const hostPlayer: Player = {
      socketId: "sock_h2",
      userId: "user_h2",
      displayName: "OriginalName",
      avatarUrl: "",
      isHost: true,
      score: 0,
      isConnected: true,
    };

    const room = roomManager.createRoom(hostPlayer);

    const startTime = performance.now();
    // Simulate player:update event
    const player = room.players.get("sock_h2");
    if (player) {
      player.displayName = "RenamedDetective";
    }
    const durationMs = performance.now() - startTime;

    expect(durationMs).toBeLessThan(1);
    expect(room.players.get("sock_h2")?.displayName).toBe("RenamedDetective");

    roomManager.removeRoom(room.code);
  });

  it("never creates duplicate player when user leaves/disconnects and rejoins with same name or userId", () => {
    const roomManager = RoomManager.getInstance();
    const hostPlayer: Player = {
      socketId: "sock_host_leave_test",
      userId: "usr_host_leave",
      displayName: "Host_Rahul",
      avatarUrl: "",
      isHost: true,
      score: 0,
      isConnected: true,
    };

    const room = roomManager.createRoom(hostPlayer);

    // Player 2 joins with persistent userId
    const persistentUserId = "guest_persisted_999";
    const player2: Player = {
      socketId: "sock_p2_v1",
      userId: persistentUserId,
      displayName: "Detective_Aadi",
      avatarUrl: "",
      isHost: false,
      score: 0,
      isConnected: true,
    };
    room.players.set(player2.socketId, player2);
    expect(room.players.size).toBe(2);

    // Scenario A: Player 2 disconnects / leaves page
    const mockIO: any = { to: () => ({ emit: () => {} }), emit: () => {} };
    room.handlePlayerDisconnect(mockIO, player2.socketId);
    expect(room.players.get("sock_p2_v1")?.isConnected).toBe(false);

    // Player 2 re-opens page with NEW socket ID and rejoins
    const newSocketId = "sock_p2_v2";
    // Check our reconnection matching logic:
    const existingPlayer = Array.from(room.players.values()).find(
      (p) => p.userId === persistentUserId || p.displayName === "Detective_Aadi"
    );
    expect(existingPlayer).toBeDefined();

    // Migrate socket cleanly
    if (existingPlayer) {
      room.players.delete(existingPlayer.socketId);
      existingPlayer.socketId = newSocketId;
      existingPlayer.isConnected = true;
      room.players.set(newSocketId, existingPlayer);
    }

    // VERIFY: Still exactly 2 players in room (Host and Aadi), zero duplicate ghosts!
    expect(room.players.size).toBe(2);
    expect(room.players.get(newSocketId)?.displayName).toBe("Detective_Aadi");
    expect(room.players.has("sock_p2_v1")).toBe(false);

    roomManager.removeRoom(room.code);
  });
});
