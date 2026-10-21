import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:4001";
const TARGET_CONNECTIONS = 500;
const BATCH_SIZE = 50;
const BATCH_INTERVAL_MS = 100;

console.log("=================================================");
console.log(`[Socket Load Test] Target: ${TARGET_CONNECTIONS} Concurrent Sockets`);
console.log(`[Socket Load Test] Server: ${SERVER_URL}`);
console.log("=================================================");

let connectedCount = 0;
let disconnectedCount = 0;
let errorCount = 0;
let pingsSent = 0;
let pongsReceived = 0;
let totalLatencyMs = 0;
let maxLatencyMs = 0;
let minLatencyMs = 999999;

const sockets = [];
const startTime = Date.now();

function spawnBatch(batchIndex) {
  const start = batchIndex * BATCH_SIZE;
  const end = Math.min(start + BATCH_SIZE, TARGET_CONNECTIONS);

  for (let i = start; i < end; i++) {
    const socket = io(SERVER_URL, {
      transports: ["websocket"],
      reconnection: false,
      timeout: 10000,
    });

    socket.on("connect", () => {
      connectedCount++;

      // Send a test ping every 1.5 seconds
      const pingInterval = setInterval(() => {
        if (!socket.connected) {
          clearInterval(pingInterval);
          return;
        }
        const pingStart = Date.now();
        pingsSent++;
        socket.emit("ping", () => {
          const lat = Date.now() - pingStart;
          pongsReceived++;
          totalLatencyMs += lat;
          if (lat > maxLatencyMs) maxLatencyMs = lat;
          if (lat < minLatencyMs) minLatencyMs = lat;
        });
      }, 1500);
    });

    socket.on("disconnect", () => {
      disconnectedCount++;
    });

    socket.on("connect_error", () => {
      errorCount++;
    });

    sockets.push(socket);
  }

  if (end < TARGET_CONNECTIONS) {
    setTimeout(() => spawnBatch(batchIndex + 1), BATCH_INTERVAL_MS);
  } else {
    console.log(
      `[Socket Load Test] Finished initiating ${TARGET_CONNECTIONS} connections in ${((Date.now() - startTime) / 1000).toFixed(2)}s`
    );
  }
}

// Progress reporter
const monitor = setInterval(() => {
  const mem = process.memoryUsage();
  const avgLat = pongsReceived > 0 ? (totalLatencyMs / pongsReceived).toFixed(2) : "0";
  console.log(
    `[Load Monitor] Active: ${connectedCount - disconnectedCount}/${TARGET_CONNECTIONS} | ` +
      `Connected: ${connectedCount} | Errs: ${errorCount} | ` +
      `Avg Latency: ${avgLat}ms (Min: ${minLatencyMs === 999999 ? 0 : minLatencyMs}ms, Max: ${maxLatencyMs}ms) | ` +
      `Runner Memory RSS: ${(mem.rss / 1024 / 1024).toFixed(1)}MB`
  );
}, 1000);

// Run test for 12 seconds, then report & cleanup
spawnBatch(0);

setTimeout(() => {
  clearInterval(monitor);
  console.log("\n=================== FINAL REPORT ===================");
  console.log(`Target Connections:     ${TARGET_CONNECTIONS}`);
  console.log(`Successfully Connected: ${connectedCount}`);
  console.log(`Failed / Errors:        ${errorCount}`);
  console.log(`Disconnections:         ${disconnectedCount}`);
  const avgLat = pongsReceived > 0 ? (totalLatencyMs / pongsReceived).toFixed(2) : "0";
  console.log(`Pings Sent / Received:  ${pingsSent} / ${pongsReceived}`);
  console.log(`Avg WebSocket Latency:  ${avgLat} ms`);
  console.log(`Min / Max Latency:      ${minLatencyMs === 999999 ? 0 : minLatencyMs} ms / ${maxLatencyMs} ms`);
  console.log("====================================================");

  // Disconnect all sockets
  sockets.forEach((s) => s.disconnect());
  process.exit(0);
}, 12000);
