import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "@/features/chat/api/chat.api";
import type { MarkAsReadResult, Message } from "@/shared/types/chat";

import { unreadQueryKeys } from "./useUnreadCount";
import { chatQueryKeys } from "./useConversations";
import { messageQueryKeys } from "./useMessages";

type UseMarkAsReadParams = {
  conversationId: string;
  limit?: number;
};

export function useMarkAsRead(params: UseMarkAsReadParams) {
  const qc = useQueryClient();
  const limit = params.limit ?? 20;
  const conversationId = params.conversationId;

  return useMutation<MarkAsReadResult, unknown, { messageId: string }>({
    mutationFn: ({ messageId }) => chatApi.markMessageAsRead(messageId),

    onSuccess: async (_data, variables) => {
      //  Optimistic: cập nhật cache messages ngay (không refetch liên tục)
      if (conversationId) {
        qc.setQueryData(
          messageQueryKeys.messages(conversationId, limit),
          (old: any) => {
            if (!old?.pages?.length) return old;

            const pages = old.pages.map((p: any) => ({ ...p }));
            for (const page of pages) {
              if (!Array.isArray(page.messages)) continue;
              page.messages = page.messages.map((m: Message) =>
                m._id === variables.messageId ? { ...m, isRead: true } : m,
              );
            }
            return { ...old, pages };
          },
        );
      }

      //  refresh badge unread count
      await qc.invalidateQueries({ queryKey: unreadQueryKeys.all });

      //  refresh conversation list (lastMessage / badge nếu có)
      await qc.invalidateQueries({ queryKey: chatQueryKeys.all });
    },
  });
}
