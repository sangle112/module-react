import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/shared/api";

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }) => authApi.changePassword(payload),
  });
}
