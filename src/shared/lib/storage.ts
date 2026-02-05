import { STORAGE_KEYS } from "@/app/config/constants";
import type { User } from "@/shared/types/user";

// fallback keys phòng trường hợp login lưu khác key
const FALLBACK_ACCESS_KEYS = ["accessToken", "token", "access_token"];
const FALLBACK_REFRESH_KEYS = ["refreshToken", "refresh_token"];

function getFirstExisting(keys: string[]) {
  for (const k of keys) {
    const v = localStorage.getItem(k);
    if (v) return v;
  }
  return null;
}

export const storage = {
  getAccessToken() {
    const raw =
      localStorage.getItem(STORAGE_KEYS.accessToken) ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("access_token");

    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed === "string") return parsed;
    } catch {
      // ignore
    }

    return raw.replace(/^"+|"+$/g, "");
  },

  setAccessToken(token: string) {
    // set đúng key chuẩn
    localStorage.setItem(STORAGE_KEYS.accessToken, token);

    // set thêm fallback để tránh lệch ở các file cũ
    localStorage.setItem("accessToken", token);
    localStorage.setItem("token", token);
    localStorage.setItem("access_token", token);
  },

  removeAccessToken() {
    localStorage.removeItem(STORAGE_KEYS.accessToken);
    FALLBACK_ACCESS_KEYS.forEach((k) => localStorage.removeItem(k));
  },

  getRefreshToken() {
    const v = localStorage.getItem(STORAGE_KEYS.refreshToken);
    if (v) return v;
    return getFirstExisting(FALLBACK_REFRESH_KEYS);
  },

  setRefreshToken(token: string) {
    localStorage.setItem(STORAGE_KEYS.refreshToken, token);
    localStorage.setItem("refreshToken", token);
    localStorage.setItem("refresh_token", token);
  },

  removeRefreshToken() {
    localStorage.removeItem(STORAGE_KEYS.refreshToken);
    FALLBACK_REFRESH_KEYS.forEach((k) => localStorage.removeItem(k));
  },

  getUser(): User | null {
    const raw = localStorage.getItem(STORAGE_KEYS.user);
    return raw ? (JSON.parse(raw) as User) : null;
  },

  setUser(user: User) {
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  },

  removeUser() {
    localStorage.removeItem(STORAGE_KEYS.user);
  },

  clearAuth() {
    this.removeAccessToken();
    this.removeRefreshToken();
    this.removeUser();
  },
};
