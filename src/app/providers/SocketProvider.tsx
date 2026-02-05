import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Socket } from "socket.io-client";
import {
  connectSocket,
  disconnectSocket,
  getSocket,
} from "@/shared/lib/socket";
import { useAuth } from "@/app/providers/AuthProvider";

type SocketState = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketState | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isHydrated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setConnected] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      disconnectSocket();
      setSocket(null);
      setConnected(false);
      return;
    }

    const s = connectSocket();
    setSocket(s ?? null);

    const current = getSocket();
    if (!current) return;

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    current.on("connect", onConnect);
    current.on("disconnect", onDisconnect);

    setConnected(current.connected);

    return () => {
      current.off("connect", onConnect);
      current.off("disconnect", onDisconnect);
    };
  }, [isAuthenticated, isHydrated]);

  const value = useMemo(() => ({ socket, isConnected }), [socket, isConnected]);

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used within SocketProvider");
  return ctx;
}
