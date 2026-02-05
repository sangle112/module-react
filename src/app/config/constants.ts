export const STORAGE_KEYS = {
  accessToken: "ig_access_token",
  refreshToken: "ig_refresh_token",
  user: "ig_user",
} as const;

export const QUERY_KEYS = {
  me: ["auth", "me"] as const,
  feed: ["posts", "feed"] as const,
  postDetail: (postId: string) => ["post-detail", postId] as const,

  comments: (postId: string) => ["comments", postId] as const,
  replies: (postId: string, commentId: string) =>
    ["replies", postId, commentId] as const,

  profile: (username: string) => ["profile", username] as const,

  explore: ["explore"] as const,

  conversations: ["chat", "conversations"] as const,

  messages: (conversationId: string) =>
    ["chat", "messages", conversationId] as const,
} as const;
