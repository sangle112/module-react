import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/shared/api";

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: {
      token: string;
      password: string;
      confirmPassword: string;
    }) =>
      authApi.resetPassword(payload.token, {
        password: payload.password,
        confirmPassword: payload.confirmPassword,
      }),
  });
}
