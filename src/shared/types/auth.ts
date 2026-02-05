import type { User } from "./user";

export type LoginPayload = { email: string; password: string };

export type RegisterPayload = {
  email: string;
  username: string;
  fullName: string;
  password: string;
  confirmPassword: string;
};

export type AuthResult = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

// Register response theo docs: chỉ trả user (chưa verified)
export type RegisterResult = {
  user: User;
};
