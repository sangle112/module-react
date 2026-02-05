// src/features/profile/hooks/useSuggestedUsers.ts
import { useQuery } from "@tanstack/react-query";
import { profileApi } from "@/shared/api/index";
import { profileKeys } from "./keys";

export function useSuggestedUsers(limit?: number) {
  return useQuery({
    queryKey: profileKeys.suggested(limit),
    queryFn: () => profileApi.getSuggestedUsers(limit),
  });
}
