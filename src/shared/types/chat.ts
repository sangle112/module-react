export type ServerResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type ConversationUser = {
  _id: string;
  username: string;
  fullName?: string;
  profilePicture?: string;
};

export type MessageType = "text" | "image";

export type Message = {
  _id: string;
  conversationId: string;
  senderId: ConversationUser;
  recipientId: string;

  messageType: MessageType;
  content?: string;
  imageUrl?: string;

  isRead: boolean;
  createdAt: string;
};

export type Conversation = {
  _id: string;
  participants: ConversationUser[];
  lastMessage: Message | null;

  lastMessageAt?: string;
  createdAt: string;
};

export type ConversationsPagination = {
  currentPage: number;
  totalPages: number;
  totalConversations: number;
  hasMore: boolean;
};

export type MessagesPagination = {
  currentPage: number;
  totalPages: number;
  totalMessages: number;
  hasMore: boolean;
};

export type GetConversationsResult = {
  conversations: Conversation[];
  pagination: ConversationsPagination;
};

export type GetMessagesResult = {
  messages: Message[];
  pagination: MessagesPagination;
};

export type PagingQuery = {
  page?: number;
  limit?: number;
};

export type SendTextMessagePayload = {
  conversationId: string;
  recipientId: string;
  content: string;
};

export type SendImageMessagePayload = {
  conversationId: string;
  recipientId: string;
  image: File;
};

export type MarkAsReadResult = {
  _id: string;
  isRead: boolean;
};

export type UnreadCountResult = {
  unreadCount: number;
};
