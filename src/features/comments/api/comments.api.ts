// src/features/comments/api/comments.api.ts
import http from "@/shared/lib/http";
import type { Comment } from "@/shared/types/comment";

type ServerResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type CommentsQuery = { limit?: number; offset?: number };

export type PaginatedComments = {
  comments: Array<
    Comment & {
      likes?: number;
      repliesCount?: number;
      parentCommentId?: string | null;
    }
  >;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalComments?: number;
    hasMore: boolean;
  };
};

export type PaginatedReplies = {
  replies: Array<Comment & { likes?: number; parentCommentId?: string | null }>;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalReplies?: number;
    hasMore: boolean;
  };
};

export const commentsApi = {
  async getPostComments(postId: string, query: CommentsQuery = {}) {
    const res = await http.get<ServerResponse<PaginatedComments>>(
      `/posts/${postId}/comments`,
      {
        params: query,
      },
    );
    return res.data.data;
  },

  async createComment(
    postId: string,
    payload: { content: string; parentCommentId?: string | null },
  ) {
    const res = await http.post<ServerResponse<Comment>>(
      `/posts/${postId}/comments`,
      {
        content: payload.content,
        parentCommentId: payload.parentCommentId ?? null,
      },
    );
    return res.data.data;
  },

  async getReplies(
    postId: string,
    commentId: string,
    query: CommentsQuery = {},
  ) {
    const res = await http.get<ServerResponse<PaginatedReplies>>(
      `/posts/${postId}/comments/${commentId}/replies`,
      { params: query },
    );
    return res.data.data;
  },

  async createReply(
    postId: string,
    commentId: string,
    payload: { content: string },
  ) {
    const res = await http.post<ServerResponse<Comment>>(
      `/posts/${postId}/comments/${commentId}/replies`,
      payload,
    );
    return res.data.data;
  },
  async updateComment(
    postId: string,
    commentId: string,
    payload: { content: string },
  ) {
    const res = await http.patch(
      `/posts/${postId}/comments/${commentId}`,
      payload,
    );
    return res.data.data;
  },

  async deleteComment(postId: string, commentId: string) {
    const res = await http.delete(`/posts/${postId}/comments/${commentId}`);
    return res.data.data;
  },

  async likeComment(postId: string, commentId: string) {
    const res = await http.post<ServerResponse<{ _id: string; likes: number }>>(
      `/posts/${postId}/comments/${commentId}/like`,
    );
    return res.data.data;
  },

  async unlikeComment(postId: string, commentId: string) {
    const res = await http.delete<
      ServerResponse<{ _id: string; likes: number }>
    >(`/posts/${postId}/comments/${commentId}/like`);
    return res.data.data;
  },
  async updateReply(
    postId: string,
    parentCommentId: string,
    replyId: string,
    payload: { content: string },
  ) {
    const res = await http.patch(
      `/posts/${postId}/comments/${parentCommentId}/replies/${replyId}`,
      payload,
    );
    return res.data.data;
  },

  async deleteReply(postId: string, parentCommentId: string, replyId: string) {
    const res = await http.delete(
      `/posts/${postId}/comments/${parentCommentId}/replies/${replyId}`,
    );
    return res.data.data;
  },
};
