// src/features/profile/hooks/useSearchUsers.ts
import { useQuery } from "@tanstack/react-query";
import { profileApi } from "@/shared/api/index";
import { profileKeys } from "./keys";

export function useSearchUsers(q: string) {
  const query = q.trim();

  return useQuery({
    queryKey: profileKeys.search(query),
    queryFn: () => profileApi.searchUsers(query),
    enabled: query.length > 0,
  });
}
