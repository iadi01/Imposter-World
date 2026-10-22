import { io, Socket } from "socket.io-client";

const getSocketUrl = (): string => {
  if (typeof window !== "undefined") {
    // If running in browser on production (Render, custom domain, or Vercel)
    if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
      if (window.location.hostname.includes("vercel.app")) {
        return "https://imposter-world.onrender.com";
      }
      return window.location.origin;
    }
    // Local dev: port 8080 connects to backend port 4001
    if (window.location.port === "8080") {
      return "http://localhost:4001";
    }
    return window.location.origin;
  }
  return "http://localhost:4001";
};

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const socketUrl = getSocketUrl();
    socket = io(socketUrl, {
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
