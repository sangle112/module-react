import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { storage } from "@/shared/lib/storage";
import type { User } from "@/shared/types/user";
import { authApi } from "@/shared/api";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
};

type AuthActions = {
  setAuth: (payload: {
    user: User;
    accessToken: string;
    refreshToken: string;
  }) => void;
  clearAuth: () => void;
  refresh: () => Promise<void>;
};

export type AuthContextValue = AuthState & AuthActions;

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(storage.getUser());
  const [isHydrating, setIsHydrating] = useState(true);

  const isAuthenticated = !!storage.getAccessToken() && !!user;

  const setAuth = useCallback(
    (payload: { user: User; accessToken: string; refreshToken: string }) => {
      storage.setAccessToken(payload.accessToken);
      storage.setRefreshToken(payload.refreshToken);
      storage.setUser(payload.user);
      setUser(payload.user);
    },
    [],
  );

  const clearAuth = useCallback(() => {
    storage.clearAuth();
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    const refreshToken = storage.getRefreshToken();
    if (!refreshToken) {
      clearAuth();
      return;
    }

    try {
      const { accessToken, refreshToken: newRefresh } =
        await authApi.refreshToken(refreshToken);
      storage.setAccessToken(accessToken);
      storage.setRefreshToken(newRefresh);
      // user giữ nguyên (API refresh thường không trả user)
    } catch {
      clearAuth();
    }
  }, [clearAuth]);

  // hydrate 1 lần khi mở app
  useEffect(() => {
    (async () => {
      try {
        // Nếu có token mà chưa có user -> cố refresh trước (đỡ 401)
        const token = storage.getAccessToken();
        const savedUser = storage.getUser();
        if (token && !savedUser) await refresh();
        setUser(storage.getUser());
      } finally {
        setIsHydrating(false);
      }
    })();
  }, [refresh]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated, isHydrating, setAuth, clearAuth, refresh }),
    [user, isAuthenticated, isHydrating, setAuth, clearAuth, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
