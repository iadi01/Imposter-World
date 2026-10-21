import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.hostname}:4001`
    : "http://localhost:4001";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("[Socket Client] Connected to real-time game server:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
      console.warn("[Socket Client] Disconnected:", reason);
    });
  }
  return socket;
}
