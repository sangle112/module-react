import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { exploreApi } from "../api/explore.api";

export function useSearchHistory(limit?: number) {
  const qc = useQueryClient();

  const historyQuery = useQuery({
    queryKey: ["search-history", { limit: limit ?? null }],
    queryFn: () => exploreApi.getSearchHistory(limit),
    staleTime: 10_000,
  });

  const deleteItem = useMutation({
    mutationFn: (historyId: string) =>
      exploreApi.deleteSearchHistoryItem(historyId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["search-history"] });
    },
  });

  const clearAll = useMutation({
    mutationFn: () => exploreApi.clearAllSearchHistory(),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["search-history"] });
    },
  });

  return {
    historyQuery,
    deleteItem,
    clearAll,
  };
}
