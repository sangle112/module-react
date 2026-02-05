import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import type { RegisterPayload } from "@/shared/types/auth";

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
  });
}
