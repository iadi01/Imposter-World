import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:4001";
const ROOMS_COUNT = 50; // 50 rooms with 4 players each = 200 concurrent active game sessions
const PLAYERS_PER_ROOM = 4;

console.log("=================================================");
console.log(`[Multiplayer Room Load Test]`);
console.log(`Target: ${ROOMS_COUNT} Rooms (${ROOMS_COUNT * PLAYERS_PER_ROOM} Active Players)`);
console.log("=================================================");

let roomsCreated = 0;
let playersJoined = 0;
let chatsSent = 0;
let chatsReceived = 0;
let errors = 0;

const startTime = Date.now();

async function runRoom(roomIndex) {
  return new Promise((resolve) => {
    // 1. Host creates room
    const hostSocket = io(SERVER_URL, { transports: ["websocket"] });

    hostSocket.on("connect", () => {
      hostSocket.emit(
        "room:create",
        {
          user: {
            id: `host_uid_${roomIndex}`,
            displayName: `Host_${roomIndex}`,
          },
          settings: { mode: "normal", maxPlayers: PLAYERS_PER_ROOM, isPublic: true },
        },
        async (res) => {
          if (!res || !res.success || !res.roomCode) {
            errors++;
            hostSocket.disconnect();
            return resolve(false);
          }

          roomsCreated++;
          const roomCode = res.roomCode;
          const otherSockets = [];

          // 2. Join other players into this room
          for (let p = 1; p < PLAYERS_PER_ROOM; p++) {
            const playerSocket = io(SERVER_URL, { transports: ["websocket"] });

            playerSocket.on("chat:new-message", () => {
              chatsReceived++;
            });

            playerSocket.on("connect", () => {
              playerSocket.emit(
                "room:join",
                {
                  roomCode,
                  user: {
                    id: `player_uid_${roomIndex}_${p}`,
                    displayName: `Player_${roomIndex}_${p}`,
                  },
                },
                (joinRes) => {
                  if (joinRes && joinRes.success) {
                    playersJoined++;
                  } else {
                    errors++;
                  }
                }
              );
            });

            otherSockets.push(playerSocket);
          }

          // 3. Send broadcast messages in this room
          setTimeout(() => {
            for (let m = 0; m < 3; m++) {
              chatsSent++;
              hostSocket.emit("chat:send", { content: `Clue #${m} from Host_${roomIndex}` });
            }

            // Cleanup after test
            setTimeout(() => {
              hostSocket.disconnect();
              otherSockets.forEach((s) => s.disconnect());
              resolve(true);
            }, 800);
          }, 1200);
        }
      );
    });

    hostSocket.on("connect_error", () => {
      errors++;
      resolve(false);
    });
  });
}

async function start() {
  const promises = [];
  for (let i = 0; i < ROOMS_COUNT; i++) {
    promises.push(runRoom(i));
    await new Promise((r) => setTimeout(r, 25));
  }

  await Promise.all(promises);

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log("\n=================== FINAL ROOM TEST REPORT ===================");
  console.log(`Execution Duration:    ${durationSec}s`);
  console.log(`Rooms Created:         ${roomsCreated} / ${ROOMS_COUNT}`);
  console.log(`Players Joined:        ${playersJoined} / ${ROOMS_COUNT * (PLAYERS_PER_ROOM - 1)}`);
  console.log(`Broadcasts Sent:       ${chatsSent}`);
  console.log(`Broadcasts Received:   ${chatsReceived}`);
  console.log(`Errors / Failures:     ${errors}`);
  console.log("==============================================================");
  process.exit(0);
}

start().catch(console.error);
