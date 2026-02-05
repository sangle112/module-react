// src/features/auth/api/auth.api.ts
import http from "@/shared/lib/http";
import type {
  LoginPayload,
  RegisterPayload,
  AuthResult,
  RegisterResult,
} from "@/shared/types/auth";

type ServerResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type RefreshTokenResult = {
  accessToken: string;
  refreshToken: string;
};

export const authApi = {
  async register(payload: RegisterPayload) {
    const res = await http.post<
      ServerResponse<{ user: RegisterResult["user"] }>
    >("/auth/register", payload);
    return res.data.data;
  },

  async login(payload: LoginPayload) {
    const res = await http.post<ServerResponse<AuthResult>>(
      "/auth/login",
      payload,
    );
    return res.data.data;
  },

  async refreshToken(refreshToken: string) {
    const res = await http.post<ServerResponse<RefreshTokenResult>>(
      "/auth/refresh-token",
      {
        refreshToken,
      },
    );
    return res.data.data;
  },

  async logout(refreshToken: string) {
    const res = await http.post<ServerResponse<null>>("/auth/logout", {
      refreshToken,
    });
    return res.data.data; // null
  },

  async verifyEmail(token: string) {
    const res = await http.post<ServerResponse<{ user: any }>>(
      `/auth/verify-email/${token}`,
    );
    return res.data.data;
  },

  async resendVerificationEmail(email: string) {
    const res = await http.post<ServerResponse<null>>(
      "/auth/resend-verification-email",
      { email },
    );
    return res.data.data; // null
  },

  async forgotPassword(email: string) {
    const res = await http.post<ServerResponse<null>>("/auth/forgot-password", {
      email,
    });
    return res.data.data; // null
  },

  async resetPassword(
    token: string,
    payload: { password: string; confirmPassword: string },
  ) {
    const res = await http.post<ServerResponse<null>>(
      `/auth/reset-password/${token}`,
      payload,
    );
    return res.data.data; // null
  },

  async changePassword(payload: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) {
    const res = await http.post<ServerResponse<null>>(
      "/auth/change-password",
      payload,
    );
    return res.data.data; // null
  },
};
