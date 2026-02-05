import http from "@/shared/lib/http";
import type { Post } from "@/shared/types/post";
import type { User } from "@/shared/types/user";
import type { Conversation, Message } from "@/shared/types/chat";

type ServerResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type ExploreQuery = { page?: number; limit?: number };

export const exploreApi = {
  async getExplorePosts(query: ExploreQuery = {}) {
    const res = await http.get<
      ServerResponse<{
        posts: Post[];
        pagination: {
          currentPage: number;
          totalPages: number;
          totalPosts?: number;
          hasMore: boolean;
        };
      }>
    >("/posts/explore", { params: query });
    return res.data.data;
  },

  async searchUsers(q: string) {
    const res = await http.get<ServerResponse<User[]>>("/users/search", {
      params: { q },
    });
    return res.data.data;
  },

  // search history (nếu bạn làm UI “recent searches”)
  async getSearchHistory(limit?: number) {
    const res = await http.get<ServerResponse<any[]>>("/search-history", {
      params: limit ? { limit } : undefined,
    });
    return res.data.data;
  },

  async deleteSearchHistoryItem(historyId: string) {
    const res = await http.delete<ServerResponse<null>>(
      `/search-history/${historyId}`,
    );
    return res.data.data; // null
  },

  async clearAllSearchHistory() {
    const res = await http.delete<ServerResponse<null>>("/search-history");
    return res.data.data; // null
  },
};
