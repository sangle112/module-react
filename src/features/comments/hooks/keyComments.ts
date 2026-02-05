export const keyComments = {
  post: (postId: string) => ["comments", postId] as const,

  list: (postId: string, params?: unknown) =>
    ["comments", postId, "list", params] as const,

  replies: (postId: string, commentId: string, params?: unknown) =>
    ["comments", postId, "replies", commentId, params] as const,
};
