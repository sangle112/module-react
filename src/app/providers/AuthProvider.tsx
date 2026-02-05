import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { storage } from "@/shared/lib/storage";
import type { User } from "@/shared/types/user";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isHydrated: boolean;
  isAuthenticated: boolean;
  setAuth: (payload: {
    user: User;
    accessToken: string;
    refreshToken: string;
  }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setUser(storage.getUser());
    setAccessToken(storage.getAccessToken());
    setRefreshToken(storage.getRefreshToken());
    setIsHydrated(true);
  }, []);

  const setAuth: AuthState["setAuth"] = (payload) => {
    storage.setUser(payload.user);
    storage.setAccessToken(payload.accessToken);
    storage.setRefreshToken(payload.refreshToken);

    setUser(payload.user);
    setAccessToken(payload.accessToken);
    setRefreshToken(payload.refreshToken);
  };

  const logout = () => {
    storage.clearAuth();
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  };

  const value = useMemo<AuthState>(
    () => ({
      user,
      accessToken,
      refreshToken,
      isHydrated,
      isAuthenticated: Boolean(accessToken),
      setAuth,
      logout,
    }),
    [user, accessToken, refreshToken, isHydrated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
