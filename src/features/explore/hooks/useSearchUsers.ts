import { useQuery } from "@tanstack/react-query";
import { exploreApi } from "../api/explore.api";

export function useSearchUsers(q: string) {
  const query = (q ?? "").trim();

  return useQuery({
    queryKey: ["explore-search-users", query],
    queryFn: () => exploreApi.searchUsers(query),
    enabled: query.length > 0,
    staleTime: 30_000,
  });
}
