import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/shared/api";

export function useResendVerifyEmail() {
  return useMutation({
    mutationFn: (email: string) => authApi.resendVerificationEmail(email),
  });
}
