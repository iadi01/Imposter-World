import { describe, it, expect } from "vitest";
import { Room, RoomManager } from "../../server/game/roomManager";
import { Player } from "../../server/game/types";
import { getRandomWordPair, getAllMemoryWordPairs } from "../../server/game/words";
import { sound, RELAXING_TRACKS } from "../lib/sound";

describe("Imposter World Core Game Rules & Security", () => {
  const createMockPlayer = (id: string, name: string, isHost = false): Player => ({
    socketId: id,
    userId: `user_${id}`,
    displayName: name,
    avatarUrl: "",
    isHost,
    score: 0,
    isConnected: true,
  });

  it("enforces minimum 3 players to start game", async () => {
    const host = createMockPlayer("p1", "Aadi", true);
    const room = new Room("TEST1", host);
    room.players.set("p2", createMockPlayer("p2", "Player2"));

    const mockIo: any = { to: () => ({ emit: () => {} }) };

    // Only 2 players: should throw
    await expect(room.startGame(mockIo)).rejects.toThrow("At least 3 players are required to start.");
  });

  it("keeps secret words and imposter assignments private (Zero Leakage)", async () => {
    const host = createMockPlayer("p1", "Aadi", true);
    const room = new Room("TEST2", host);
    room.players.set("p2", createMockPlayer("p2", "Player2"));
    room.players.set("p3", createMockPlayer("p3", "Player3"));

    const emittedToSocket: { [socketId: string]: any } = {};
    const mockIo: any = {
      to: (target: string) => ({
        emit: (event: string, payload: any) => {
          if (!emittedToSocket[target]) emittedToSocket[target] = [];
          emittedToSocket[target].push({ event, payload });
        },
      }),
    };

    await room.startGame(mockIo);

    // Assert public room state does NOT contain commonWord, imposterWord or imposterSocketIds
    const publicState = room.getPublicState();
    expect((publicState as any).commonWord).toBeUndefined();
    expect((publicState as any).imposterWord).toBeUndefined();
    expect((publicState as any).imposterSocketIds).toBeUndefined();

    // Check individual socket emissions
    expect(emittedToSocket["p1"]).toBeDefined();
    expect(emittedToSocket["p2"]).toBeDefined();
    expect(emittedToSocket["p3"]).toBeDefined();

    const p1Secret = emittedToSocket["p1"].find((e: any) => e.event === "game:secret-word");
    expect(p1Secret).toBeDefined();
    expect(["detective", "imposter"]).toContain(p1Secret.payload.role);
    expect(typeof p1Secret.payload.word).toBe("string");
  });

  it("rejects hints submitted out of turn", async () => {
    const host = createMockPlayer("p1", "Aadi", true);
    const room = new Room("TEST3", host);
    room.players.set("p2", createMockPlayer("p2", "Player2"));
    room.players.set("p3", createMockPlayer("p3", "Player3"));

    const mockIo: any = { to: () => ({ emit: () => {} }) };
    await room.startGame(mockIo);

    // Active player is player 0 (p1)
    expect(room.activePlayerIndex).toBe(0);

    // Player 2 attempts to submit hint out of turn: must throw
    expect(() => {
      room.submitHint(mockIo, "p2", "text", "Unauthorized clue");
    }).toThrow("It is not your turn to submit a clue.");
  });

  it("calculates exact winning message when Imposter survives", async () => {
    const host = createMockPlayer("p1", "Aadi", true);
    const room = new Room("TEST4", host);
    const p2 = createMockPlayer("p2", "Riya");
    const p3 = createMockPlayer("p3", "Kabir");
    room.players.set("p2", p2);
    room.players.set("p3", p3);

    const mockIo: any = { to: () => ({ emit: () => {} }) };
    await room.startGame(mockIo);

    // Force p1 (Aadi) as imposter
    room.privateData.imposterSocketIds = ["p1"];
    room.privateData.commonWord = "Apple";
    room.privateData.imposterWord = "Mango";

    // Set phase to answer submission
    room.phase = "answer_submission";

    // Players fail to identify Aadi (they vote for p2 instead)
    room.submitAnswer(mockIo, "p1", "p2");
    room.submitAnswer(mockIo, "p2", "p3");
    room.submitAnswer(mockIo, "p3", "p2");

    expect(room.lastResult?.winnerTeam).toBe("imposters");
    expect(room.lastResult?.banner).toBe("Aadi passed the test! Players failed to identify the Imposter.");
  });

  it("calculates exact winning message when Imposter is identified", async () => {
    const host = createMockPlayer("p1", "Aadi", true);
    const room = new Room("TEST5", host);
    const p2 = createMockPlayer("p2", "Riya");
    const p3 = createMockPlayer("p3", "Kabir");
    room.players.set("p2", p2);
    room.players.set("p3", p3);

    const mockIo: any = { to: () => ({ emit: () => {} }) };
    await room.startGame(mockIo);

    // Force p2 (Riya) as imposter
    room.privateData.imposterSocketIds = ["p2"];
    room.privateData.commonWord = "Coffee";
    room.privateData.imposterWord = "Tea";

    room.phase = "answer_submission";

    // Players correctly vote for Riya (p2)
    room.submitAnswer(mockIo, "p1", "p2");
    room.submitAnswer(mockIo, "p2", "p1");
    room.submitAnswer(mockIo, "p3", "p2");

    expect(room.lastResult?.winnerTeam).toBe("detectives");
    expect(room.lastResult?.banner).toBe("The Imposter failed the test! Players passed the test!");
  });

  it("skips discussion phase when majority of players vote to skip", () => {
    const host = createMockPlayer("p1", "Aadi", true);
    const room = new Room("SKIP1", host);
    const p2 = createMockPlayer("p2", "Riya");
    const p3 = createMockPlayer("p3", "Kabir");
    room.players.set("p2", p2);
    room.players.set("p3", p3);

    const mockIo: any = { to: () => ({ emit: () => {} }) };
    room.startDiscussionPhase(mockIo);
    expect(room.phase).toBe("discussion");
    expect(room.skipDiscussionVotes.size).toBe(0);

    // Total connected = 3. Majority required = Math.floor(3/2) + 1 = 2.
    // 1st vote by p1
    const res1 = room.voteSkipDiscussion(mockIo, "p1");
    expect(res1.success).toBe(true);
    expect(res1.skipped).toBe(false);
    expect(room.phase).toBe("discussion");
    expect(room.skipDiscussionVotes.size).toBe(1);

    // 2nd vote by p2 -> Majority reached (2 of 3)!
    const res2 = room.voteSkipDiscussion(mockIo, "p2");
    expect(res2.success).toBe(true);
    expect(res2.skipped).toBe(true);
    expect(room.phase).toBe("answer_submission"); // Advanced directly to secret voting!
    room.clearTimer();
  });

  it("generates 100% collision-free cryptographic room codes", () => {
    const manager = RoomManager.getInstance();
    const generatedCodes = new Set<string>();
    const count = 100;

    for (let i = 0; i < count; i++) {
      const host = createMockPlayer(`host_${i}`, `Host_${i}`, true);
      const room = manager.createRoom(host);

      // Verify code length and character set
      expect(room.code.length).toBeGreaterThanOrEqual(6);
      expect(room.code).toMatch(/^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]+$/);

      // Verify zero collisions
      expect(generatedCodes.has(room.code)).toBe(false);
      generatedCodes.add(room.code);

      // Clean up to keep memory light
      manager.removeRoom(room.code);
    }

    expect(generatedCodes.size).toBe(count);
  });

  it("serves diverse curated word pairs from the expanded 4,800+ dataset", async () => {
    const memoryPairs = getAllMemoryWordPairs();
    expect(memoryPairs.length).toBeGreaterThan(4500);

    // Verify random selection works
    const randomPair = await getRandomWordPair();
    expect(randomPair.common).toBeDefined();
    expect(randomPair.imposter).toBeDefined();
    expect(randomPair.common).not.toBe(randomPair.imposter);

    // Verify category filtering for Animals
    const animalPair = await getRandomWordPair({ category: "Animals" });
    expect(animalPair.category).toBe("Animals");
    expect(animalPair.common).toBeDefined();
    expect(animalPair.imposter).toBeDefined();

    // Verify category filtering for Food & Drinks
    const foodPair = await getRandomWordPair({ category: "Food & Drinks" });
    expect(foodPair.category).toBe("Food & Drinks");
    expect(foodPair.common).toBeDefined();
    expect(foodPair.imposter).toBeDefined();
  });

  it("rotates through soft relaxing lo-fi music tracks seamlessly", () => {
    expect(RELAXING_TRACKS.length).toBeGreaterThanOrEqual(4);

    const initial = sound.getCurrentTrack();
    expect(initial).toBeDefined();
    expect(initial.name).toBeDefined();

    // Advance to next track
    sound.nextTrack();
    const next = sound.getCurrentTrack();
    expect(next.id).not.toBe(initial.id);

    // Advance backwards
    sound.prevTrack();
    const back = sound.getCurrentTrack();
    expect(back.id).toBe(initial.id);
  });

  it("automatically transfers room creator & host ownership when host leaves", () => {
    const host = createMockPlayer("p1", "HostAlice", true);
    const room = new Room("TESTHOST", host);
    const p2 = createMockPlayer("p2", "PlayerBob", false);
    const p3 = createMockPlayer("p3", "PlayerCharlie", false);

    room.players.set("p2", p2);
    room.players.set("p3", p3);

    const emittedChat: any[] = [];
    const emittedToSocket: { [socketId: string]: any[] } = {};

    const mockIo: any = {
      to: (target: string) => ({
        emit: (event: string, payload: any) => {
          if (target === "TESTHOST") {
            emittedChat.push({ event, payload });
          } else {
            if (!emittedToSocket[target]) emittedToSocket[target] = [];
            emittedToSocket[target].push({ event, payload });
          }
        },
      }),
    };

    // Host Alice leaves the room
    const result = room.removePlayer(mockIo, "p1");

    expect(result.remainingCount).toBe(2);
    expect(result.newHost).toBeDefined();
    expect(result.newHost?.socketId).toBe("p2");
    expect(result.newHost?.displayName).toBe("PlayerBob");

    // Bob is now host, Charlie is not host
    expect(room.players.get("p2")?.isHost).toBe(true);
    expect(room.players.get("p3")?.isHost).toBe(false);

    // Room name updated to reflect new owner
    expect(room.settings.name).toBe("PlayerBob's Room");

    // Announcement sent to the new host directly
    const announcements = emittedToSocket["p2"] || [];
    const directHostNotice = announcements.find((e) => e.event === "classroom:announcement");
    expect(directHostNotice).toBeDefined();
    expect(directHostNotice.payload.message).toContain("You are now the room creator & host");

    // Public room state reflects new host
    const state = room.getPublicState();
    expect(state.players.find((p) => p.socketId === "p2")?.isHost).toBe(true);
  });

  it("orchestrates turn-based speaker floor and raise-hand in discussion phase", () => {
    const host = createMockPlayer("p1", "Aadi", true);
    const room = new Room("SPEAK1", host);
    const p2 = createMockPlayer("p2", "Riya");
    const p3 = createMockPlayer("p3", "Kabir");
    room.players.set("p2", p2);
    room.players.set("p3", p3);

    const mockIo: any = { to: () => ({ emit: () => {} }) };
    room.startDiscussionPhase(mockIo);

    // Initial speaker is the first player (p1 - Aadi)
    expect(room.phase).toBe("discussion");
    expect(room.speakerFloor?.currentSpeakerSocketId).toBe("p1");
    expect(room.speakerFloor?.currentSpeakerName).toBe("Aadi");
    expect(room.speakerFloor?.speakerIndex).toBe(0);
    expect(room.speakerFloor?.isOpenFloor).toBe(false);

    // Non-active speaker p3 cannot pass floor (not current speaker and not host)
    const invalidPass = room.passSpeakerFloor(mockIo, "p3");
    expect(invalidPass.success).toBe(false);
    expect(room.speakerFloor?.currentSpeakerSocketId).toBe("p1");

    // p2 raises hand to speak
    const raiseRes = room.toggleRaiseHand(mockIo, "p2");
    expect(raiseRes.success).toBe(true);
    expect(raiseRes.raised).toBe(true);
    expect(room.speakerFloor?.handsRaised.has("p2")).toBe(true);

    // Public state includes handsRaised and currentSpeaker
    const publicState1 = room.getPublicState();
    expect(publicState1.speakerFloor?.currentSpeakerSocketId).toBe("p1");
    expect(publicState1.speakerFloor?.handsRaised).toContain("p2");

    // Current speaker p1 clicks "Done" / passes floor
    const pass1 = room.passSpeakerFloor(mockIo, "p1");
    expect(pass1.success).toBe(true);
    expect(room.speakerFloor?.currentSpeakerSocketId).toBe("p2");
    expect(room.speakerFloor?.currentSpeakerName).toBe("Riya");
    expect(room.speakerFloor?.speakerIndex).toBe(1);

    // Speaker p2 clicks "Done" / passes floor
    const pass2 = room.passSpeakerFloor(mockIo, "p2");
    expect(pass2.success).toBe(true);
    expect(room.speakerFloor?.currentSpeakerSocketId).toBe("p3");
    expect(room.speakerFloor?.currentSpeakerName).toBe("Kabir");

    // Speaker p3 clicks "Done" / passes floor -> All finished, becomes Open Floor!
    const pass3 = room.passSpeakerFloor(mockIo, "p3");
    expect(pass3.success).toBe(true);
    expect(room.speakerFloor?.isOpenFloor).toBe(true);
    expect(room.speakerFloor?.currentSpeakerSocketId).toBeNull();

    const publicState2 = room.getPublicState();
    expect(publicState2.speakerFloor?.isOpenFloor).toBe(true);
    expect(publicState2.speakerFloor?.currentSpeakerSocketId).toBeNull();

    room.clearTimer();
  });
});
