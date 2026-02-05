import { useQuery } from "@tanstack/react-query";
import { profileApi } from "@/shared/api/index";
import { profileKeys } from "./keys";

export function useUserProfile(userId?: string) {
  return useQuery({
    queryKey: userId ? profileKeys.user(userId) : ["user", "unknown"],
    queryFn: () => {
      if (!userId) throw new Error("Missing userId");
      return profileApi.getUserById(userId);
    },
    enabled: Boolean(userId),
  });
}
