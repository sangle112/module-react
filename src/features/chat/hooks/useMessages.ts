import { useInfiniteQuery } from "@tanstack/react-query";
import { chatApi } from "@/features/chat/api/chat.api";
import type { GetMessagesResult } from "@/shared/types/chat";

export const messageQueryKeys = {
  all: ["chat"] as const,
  messages: (conversationId: string, limit?: number) =>
    [...messageQueryKeys.all, "messages", { conversationId, limit }] as const,
};

type UseMessagesParams = {
  conversationId?: string;
  limit?: number;
  enabled?: boolean;
};

export function useMessages(params: UseMessagesParams) {
  const conversationId = params.conversationId;
  const limit = params.limit ?? 20;

  const enabled =
    (params.enabled ?? true) &&
    Boolean(conversationId && conversationId.trim().length > 0);

  return useInfiniteQuery<GetMessagesResult>({
    queryKey: messageQueryKeys.messages(conversationId ?? "", limit),
    enabled,
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      // enabled đã đảm bảo conversationId có
      return chatApi.getMessages(conversationId as string, {
        page: Number(pageParam),
        limit,
      });
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.pagination?.hasMore) return undefined;
      return lastPage.pagination.currentPage + 1;
    },
  });
}

/** Helper: flatten messages (giữ đúng thứ tự server trả theo từng page) */
export function getMessagesFromInfiniteData(
  data?: { pages: GetMessagesResult[] } | undefined,
) {
  return data?.pages.flatMap((p) => p.messages) ?? [];
}
