export const profileKeys = {
  me: () => ["me"] as const,
  user: (userId: string) => ["user", userId] as const,
  search: (q: string) => ["users", "search", q] as const,
  suggested: (limit?: number) =>
    ["users", "suggested", limit ?? "default"] as const,
};
