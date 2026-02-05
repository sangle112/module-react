import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/shared/api";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
  });
}
