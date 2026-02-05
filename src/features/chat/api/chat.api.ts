// src/features/chat/api/chat.api.ts
import http from "@/shared/lib/http";

import type {
  ServerResponse,
  Conversation,
  GetConversationsResult,
  GetMessagesResult,
  PagingQuery,
  SendTextMessagePayload,
  SendImageMessagePayload,
  Message,
  MarkAsReadResult,
  UnreadCountResult,
} from "@/shared/types/chat";

export const chatApi = {
  async getConversations(
    query: PagingQuery = {},
  ): Promise<GetConversationsResult> {
    const res = await http.get<ServerResponse<GetConversationsResult>>(
      "/messages/conversations",
      { params: query },
    );
    return res.data.data;
  },

  async createOrGetConversation(userId: string): Promise<Conversation> {
    const res = await http.post<ServerResponse<Conversation>>(
      "/messages/conversations",
      { userId },
    );
    return res.data.data;
  },

  async getMessages(
    conversationId: string,
    query: PagingQuery = {},
  ): Promise<GetMessagesResult> {
    const res = await http.get<ServerResponse<GetMessagesResult>>(
      `/messages/conversations/${conversationId}/messages`,
      { params: query },
    );
    return res.data.data;
  },

  async sendTextMessage(payload: SendTextMessagePayload): Promise<Message> {
    const res = await http.post<ServerResponse<Message>>("/messages/messages", {
      conversationId: payload.conversationId,
      recipientId: payload.recipientId,
      messageType: "text",
      content: payload.content,
    });
    return res.data.data;
  },

  async sendImageMessage(payload: SendImageMessagePayload): Promise<Message> {
    const form = new FormData();
    form.append("conversationId", payload.conversationId);
    form.append("recipientId", payload.recipientId);
    form.append("messageType", "image");
    form.append("image", payload.image);

    const res = await http.post<ServerResponse<Message>>(
      "/messages/messages",
      form,
    );
    return res.data.data;
  },

  async markMessageAsRead(messageId: string): Promise<MarkAsReadResult> {
    const res = await http.put<ServerResponse<MarkAsReadResult>>(
      `/messages/messages/${messageId}/read`,
    );
    return res.data.data;
  },

  async getUnreadCount(): Promise<UnreadCountResult> {
    const res = await http.get<ServerResponse<UnreadCountResult>>(
      "/messages/unread-count",
    );
    return res.data.data;
  },
};
