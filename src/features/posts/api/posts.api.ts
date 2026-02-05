import http from "@/shared/lib/http";
import type { Post } from "@/shared/types/post";

type ServerResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type FeedQuery = { limit?: number; offset?: number };
export type ExploreQuery = { page?: number; limit?: number };

export type PaginatedPosts = {
  posts: Post[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPosts?: number;
    hasMore: boolean;
  };
};

export const postsApi = {
  async getFeed(query: FeedQuery = {}) {
    const res = await http.get<ServerResponse<PaginatedPosts>>("/posts/feed", {
      params: query,
    });
    return res.data.data;
  },

  async getExplore(query: ExploreQuery = {}) {
    const res = await http.get<ServerResponse<PaginatedPosts>>(
      "/posts/explore",
      { params: query },
    );
    return res.data.data;
  },

  async getPostById(postId: string) {
    const res = await http.get<ServerResponse<Post>>(`/posts/${postId}`);
    return res.data.data;
  },

  async getUserPosts(
    userId: string,
    query: {
      filter?: "all" | "video" | "saved";
      limit?: number;
      offset?: number;
    } = {},
  ) {
    const res = await http.get<ServerResponse<PaginatedPosts>>(
      `/posts/user/${userId}`,
      {
        params: query,
      },
    );
    return res.data.data;
  },

  async createPost(payload: { file: File; caption?: string }) {
    const form = new FormData();
    form.append("file", payload.file);
    if (payload.caption) form.append("caption", payload.caption);

    const res = await http.post<ServerResponse<Post>>("/posts", form);
    return res.data.data;
  },

  async updatePost(postId: string, payload: { caption: string }) {
    const res = await http.patch<ServerResponse<Partial<Post>>>(
      `/posts/${postId}`,
      payload,
    );
    return res.data.data;
  },

  async deletePost(postId: string) {
    const res = await http.delete<ServerResponse<null>>(`/posts/${postId}`);
    return res.data.data; // null
  },

  async likePost(postId: string) {
    const res = await http.post<ServerResponse<{ _id: string; likes: number }>>(
      `/posts/${postId}/like`,
    );
    return res.data.data;
  },

  async unlikePost(postId: string) {
    const res = await http.delete<
      ServerResponse<{ _id: string; likes: number }>
    >(`/posts/${postId}/like`);
    return res.data.data;
  },

  async savePost(postId: string) {
    const res = await http.post<ServerResponse<null>>(`/posts/${postId}/save`);
    return res.data.data; // null
  },

  async unsavePost(postId: string) {
    const res = await http.delete<ServerResponse<null>>(
      `/posts/${postId}/save`,
    );
    return res.data.data; // null
  },
};
