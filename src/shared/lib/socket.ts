import { io, Socket } from "socket.io-client";
import { env } from "@/app/config/env";
import { storage } from "@/shared/lib/storage";

let socket: Socket | null = null;

export function getSocket(): Socket | null {
  return socket;
}

export function connectSocket(): Socket | null {
  const token = storage.getAccessToken();
  if (!token) return null;

  if (socket && (socket.connected || socket.active)) return socket;

  socket = io(env.SOCKET_URL, {
    transports: ["websocket", "polling"],
    auth: { token },
    autoConnect: true,
  });

  return socket;
}

export function disconnectSocket(): void {
  if (!socket) return;
  socket.disconnect();
  socket = null;
}
