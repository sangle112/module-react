export const postKeys = {
  feed: () => ["posts", "feed"] as const,
  explore: () => ["posts", "explore"] as const,
  detail: (postId: string) => ["posts", "detail", postId] as const,
  userPosts: (userId: string, filter: string) =>
    ["userPosts", userId, filter] as const,
};
