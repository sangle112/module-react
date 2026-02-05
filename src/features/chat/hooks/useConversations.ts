import { useInfiniteQuery } from "@tanstack/react-query";
import { chatApi } from "@/features/chat/api/chat.api";
import type { GetConversationsResult } from "@/shared/types/chat";

type UseConversationsParams = {
  limit?: number;
};

export const chatQueryKeys = {
  all: ["chat"] as const,
  conversations: (limit?: number) =>
    [...chatQueryKeys.all, "conversations", { limit }] as const,
};

export function useConversations(params: UseConversationsParams = {}) {
  const limit = params.limit ?? 20;

  return useInfiniteQuery<GetConversationsResult>({
    queryKey: chatQueryKeys.conversations(limit),
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      chatApi.getConversations({ page: Number(pageParam), limit }),

    getNextPageParam: (lastPage) => {
      if (!lastPage?.pagination?.hasMore) return undefined;
      return lastPage.pagination.currentPage + 1;
    },
  });
}

/** Helper: flatten conversations from infinite pages */
export function getConversationsFromInfiniteData(
  data?: { pages: GetConversationsResult[] } | undefined,
) {
  return data?.pages.flatMap((p) => p.conversations) ?? [];
}
