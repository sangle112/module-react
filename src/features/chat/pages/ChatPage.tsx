import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "@/app/providers/AuthProvider";

import { ChatList } from "../components/ChatList";
import { ChatWindow } from "../components/ChatWindow";

import {
  useConversations,
  getConversationsFromInfiniteData,
} from "../hooks/useConversations";
import { useMessages, getMessagesFromInfiniteData } from "../hooks/useMessages";
import { useSendMessage } from "../hooks/useSendMessage";
import { useChatRealtime } from "../hooks/useChatRealtime";
import { useMarkAsRead } from "../hooks/useMarkAsRead";

function getConversationId(c: any): string | undefined {
  return c?._id ?? c?.id;
}

export default function ChatPage() {
  const navigate = useNavigate();
  const location = useLocation() as any;
  const params = useParams<{ conversationId?: string }>();

  const { user, isHydrated } = useAuth();
  const currentUserId = user?._id;

  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(params.conversationId ?? null);

  // sync state khi URL có params (chuẩn bị cho Hướng B sau này)
  useEffect(() => {
    if (
      params.conversationId &&
      params.conversationId !== activeConversationId
    ) {
      setActiveConversationId(params.conversationId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.conversationId]);

  // ✅ Hướng A: nhận conversationId từ navigate("/chats", { state: { conversationId } })
  useEffect(() => {
    const idFromState = location.state?.conversationId as string | undefined;
    if (idFromState && idFromState !== activeConversationId) {
      setActiveConversationId(idFromState);

      // clear state để refresh trang không bị set lại
      navigate("/chats", { replace: true, state: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.conversationId]);

  // conversations
  const conversationsQuery = useConversations({ limit: 20 });
  const conversations = useMemo(
    () => getConversationsFromInfiniteData(conversationsQuery.data),
    [conversationsQuery.data],
  );

  const activeConversation = useMemo(() => {
    return conversations.find(
      (c) => getConversationId(c) === activeConversationId,
    );
  }, [conversations, activeConversationId]);

  // messages
  const messagesQuery = useMessages({
    conversationId: activeConversationId ?? undefined,
    limit: 20,
    enabled: Boolean(activeConversationId && currentUserId),
  });

  const messages = useMemo(
    () => getMessagesFromInfiniteData(messagesQuery.data),
    [messagesQuery.data],
  );

  // send message
  const sendMessage = useSendMessage({
    conversationId: activeConversationId ?? "",
    limit: 20,
  });

  const recipientId = useMemo(() => {
    if (!activeConversation || !currentUserId) return undefined;
    return activeConversation.participants.find(
      (p: any) => p._id !== currentUserId,
    )?._id;
  }, [activeConversation, currentUserId]);

  // realtime
  useChatRealtime({
    currentUserId,
    activeConversationId,
    limit: 20,
  });

  // mark as read (auto)
  const markAsRead = useMarkAsRead({
    conversationId: activeConversationId ?? "",
    limit: 20,
  });

  const markedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    markedRef.current = new Set();
  }, [activeConversationId]);

  useEffect(() => {
    if (!currentUserId) return;
    if (!activeConversationId) return;
    if (!messages || messages.length === 0) return;

    const unread = messages.filter(
      (m: any) =>
        (m.senderId?._id ?? m.senderId) !== currentUserId && !m.isRead,
    );
    if (unread.length === 0) return;

    for (const m of unread) {
      if (markedRef.current.has(m._id)) continue;
      markedRef.current.add(m._id);
      markAsRead.mutate({ messageId: m._id });
    }
  }, [messages, currentUserId, activeConversationId, markAsRead]);

  if (!isHydrated) return null;
  if (!user) return null;

  return (
    <div className="h-[calc(100vh-64px)] grid grid-cols-[360px_1fr] border rounded-xl overflow-hidden">
      <div className="border-r">
        <ChatList
          conversations={conversations}
          currentUserId={user._id}
          activeConversationId={activeConversationId ?? undefined}
          onSelect={(c: any) => {
            const id = getConversationId(c);
            if (!id) return;

            setActiveConversationId(id);
            // ✅ Hướng A: không navigate /chats/:id
            navigate("/chats");
          }}
          hasMore={conversationsQuery.hasNextPage}
          onLoadMore={() => conversationsQuery.fetchNextPage()}
          isLoadingMore={conversationsQuery.isFetchingNextPage}
        />
      </div>

      <ChatWindow
        conversation={activeConversation}
        messages={messages}
        currentUserId={user._id}
        recipientId={recipientId}
        hasMore={messagesQuery.hasNextPage}
        onLoadMore={() => messagesQuery.fetchNextPage()}
        isLoadingMore={messagesQuery.isFetchingNextPage}
        onSendText={({ recipientId, content }) =>
          sendMessage.sendText({ recipientId, content })
        }
        onSendImage={({ recipientId, image }) =>
          sendMessage.sendImage({ recipientId, image })
        }
        disabled={
          sendMessage.isSending || !activeConversationId || !recipientId
        }
      />
    </div>
  );
}
