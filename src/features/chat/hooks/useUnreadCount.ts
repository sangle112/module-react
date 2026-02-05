import { useQuery } from "@tanstack/react-query";
import { chatApi } from "@/features/chat/api/chat.api";
import type { UnreadCountResult } from "@/shared/types/chat";

export const unreadQueryKeys = {
  all: ["chat", "unread"] as const,
  count: () => [...unreadQueryKeys.all, "count"] as const,
};

export function useUnreadCount(enabled: boolean = true) {
  return useQuery<UnreadCountResult>({
    queryKey: unreadQueryKeys.count(),
    queryFn: () => chatApi.getUnreadCount(),
    enabled,
    // badge không cần realtime chính xác từng ms, giảm load
    staleTime: 15_000,
    refetchOnWindowFocus: true,
  });
}
