import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { storage } from "./storage";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // giữ nguyên cách bạn đặt
  withCredentials: false, // giữ nguyên
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use(
  (config) => {
    const accessToken = storage.getAccessToken();

    config.headers = config.headers ?? {};

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (config.data instanceof FormData) {
      delete (config.headers as any)["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/** =========================
 * Refresh token on 401
 * ========================= */
let isRefreshing = false;
let queue: Array<(token?: string) => void> = [];

function resolveQueue(token?: string) {
  queue.forEach((cb) => cb(token));
  queue = [];
}

function joinUrl(base: string, path: string) {
  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (status !== 401 || !original || original._retry) {
      return Promise.reject(error);
    }

    // tránh refresh khi chính request refresh/login fail
    const url = original.url ?? "";
    if (
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/refresh-token")
    ) {
      return Promise.reject(error);
    }

    const refreshToken = storage.getRefreshToken();
    if (!refreshToken) {
      storage.clearAuth();
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push((newToken) => {
          if (!newToken) return reject(error);
          original.headers = original.headers ?? {};
          (original.headers as Record<string, string>).Authorization =
            `Bearer ${newToken}`;
          resolve(http(original));
        });
      });
    }

    isRefreshing = true;

    try {
      const base =
        typeof http.defaults.baseURL === "string"
          ? http.defaults.baseURL
          : "/api";
      const refreshUrl = base.startsWith("http")
        ? joinUrl(base, "/auth/refresh-token")
        : "/api/auth/refresh-token";

      // gọi bằng axios thường để tránh loop interceptor
      const res = await axios.post(
        refreshUrl,
        { refreshToken },
        { withCredentials: false },
      );

      const newAccessToken = (res.data as any)?.accessToken as
        | string
        | undefined;
      const newRefreshToken = (res.data as any)?.refreshToken as
        | string
        | undefined;

      if (!newAccessToken || !newRefreshToken) {
        storage.clearAuth();
        resolveQueue();
        return Promise.reject(error);
      }

      storage.setAccessToken(newAccessToken);
      storage.setRefreshToken(newRefreshToken);

      resolveQueue(newAccessToken);

      original.headers = original.headers ?? {};
      (original.headers as Record<string, string>).Authorization =
        `Bearer ${newAccessToken}`;

      return http(original);
    } catch (e) {
      storage.clearAuth();
      resolveQueue();
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);

export default http;
