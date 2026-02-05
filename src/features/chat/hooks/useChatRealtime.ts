import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Message } from "@/shared/types/chat";
import { useSocket } from "@/app/providers/SocketProvider";

import { messageQueryKeys } from "./useMessages";
import { chatQueryKeys } from "./useConversations";
import { unreadQueryKeys } from "./useUnreadCount";

type Params = {
  currentUserId?: string;
  activeConversationId?: string | null;
  limit?: number;
};

const MESSAGE_EVENTS = [
  "receive_message",
  "new_message",
  "message:new",
  "message",
] as const;

function isMessageLike(payload: any): payload is Message {
  return (
    payload &&
    typeof payload === "object" &&
    typeof payload._id === "string" &&
    typeof payload.conversationId === "string" &&
    payload.senderId &&
    typeof payload.senderId._id === "string" &&
    typeof payload.createdAt === "string"
  );
}

export function useChatRealtime({
  currentUserId,
  activeConversationId,
  limit = 20,
}: Params) {
  const { socket, isConnected } = useSocket();
  const qc = useQueryClient();

  useEffect(() => {
    if (!socket || !isConnected) return;
    if (!currentUserId) return;

    const onIncoming = (payload: any) => {
      if (!isMessageLike(payload)) {
        qc.invalidateQueries({ queryKey: chatQueryKeys.all });
        qc.invalidateQueries({ queryKey: unreadQueryKeys.all });

        if (activeConversationId) {
          qc.invalidateQueries({
            queryKey: messageQueryKeys.messages(activeConversationId, limit),
          });
        }
        return;
      }

      const msg = payload;

      // update messages cache nếu đúng conversation đang mở
      if (activeConversationId && msg.conversationId === activeConversationId) {
        qc.setQueryData(
          messageQueryKeys.messages(activeConversationId, limit),
          (old: any) => {
            if (!old?.pages?.length) return old;

            const existed = old.pages.some((p: any) =>
              p.messages?.some((m: Message) => m._id === msg._id),
            );
            if (existed) return old;

            const pages = old.pages.map((p: any) => ({ ...p }));
            const lastIdx = pages.length - 1;
            pages[lastIdx] = {
              ...pages[lastIdx],
              messages: [...(pages[lastIdx].messages ?? []), msg],
            };

            return { ...old, pages };
          },
        );
      }

      // update conversations list (lastMessage + move to top)
      qc.setQueriesData(
        {
          predicate: (q) =>
            Array.isArray(q.queryKey) &&
            q.queryKey[0] === "chat" &&
            q.queryKey[1] === "conversations",
        },
        (old: any) => {
          if (!old?.pages?.length) return old;

          const pages = old.pages.map((p: any) => ({ ...p }));
          const all = pages.flatMap((p: any) => p.conversations ?? []);

          const idx = all.findIndex((c: any) => c._id === msg.conversationId);
          if (idx === -1) {
            qc.invalidateQueries({ queryKey: chatQueryKeys.all });
            return old;
          }

          const conv = all[idx];
          const updated = {
            ...conv,
            lastMessage: msg,
            lastMessageAt: msg.createdAt,
          };
          const newAll = [
            updated,
            ...all.filter((c: any) => c._id !== msg.conversationId),
          ];

          let cursor = 0;
          const nextPages = pages.map((p: any) => {
            const size = (p.conversations?.length ?? 0) || 0;
            const slice = newAll.slice(cursor, cursor + size);
            cursor += size;
            return { ...p, conversations: slice };
          });

          return { ...old, pages: nextPages };
        },
      );

      // unread badge
      const isMine = msg.senderId?._id === currentUserId;
      if (!isMine) qc.invalidateQueries({ queryKey: unreadQueryKeys.all });
    };

    MESSAGE_EVENTS.forEach((evt) => socket.on(evt, onIncoming));
    return () => {
      MESSAGE_EVENTS.forEach((evt) => socket.off(evt, onIncoming));
    };
  }, [socket, isConnected, qc, currentUserId, activeConversationId, limit]);
}
