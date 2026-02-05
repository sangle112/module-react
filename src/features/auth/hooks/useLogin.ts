import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import type { LoginPayload } from "@/shared/types/auth";
import { useAuth } from "@/app/providers/AuthProvider";

type LoginApiData =
  | { user: any; accessToken: string; refreshToken: string }
  | { user: any; tokens: { accessToken: string; refreshToken: string } };

function pickTokens(data: LoginApiData) {
  if ("accessToken" in data) {
    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user,
    };
  }
  return {
    accessToken: data.tokens.accessToken,
    refreshToken: data.tokens.refreshToken,
    user: data.user,
  };
}

export function useLogin() {
  const { setAuth } = useAuth();

  return useMutation({
    mutationFn: (payload: LoginPayload) =>
      authApi.login(payload) as Promise<LoginApiData>,
    onSuccess: (data) => {
      const { user, accessToken, refreshToken } = pickTokens(data);
      setAuth({ user, accessToken, refreshToken });
    },
  });
}
