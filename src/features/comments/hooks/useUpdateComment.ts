import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentsApi } from "../api/comments.api";
import { keyComments } from "./keyComments";

export function useUpdateComment(postId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      commentId: string;
      content: string;
      parentCommentId?: string | null;
    }) => {
      if (payload.parentCommentId) {
        return commentsApi.updateReply(
          postId,
          payload.parentCommentId,
          payload.commentId,
          {
            content: payload.content,
          },
        );
      }

      return commentsApi.updateComment(postId, payload.commentId, {
        content: payload.content,
      });
    },

    onSuccess: (updated, variables) => {
      const { commentId } = variables;

      qc.setQueriesData({ queryKey: keyComments.post(postId) }, (old: any) => {
        if (!old) return old;

        const patch = (arr: any[]) =>
          arr.map((c) =>
            (c?._id ?? c?.id) === commentId
              ? {
                  ...c,
                  content: updated.content,
                  updatedAt: updated.updatedAt,
                }
              : c,
          );

        if (old?.pages) {
          return {
            ...old,
            pages: old.pages.map((p: any) => ({
              ...p,
              comments: p.comments ? patch(p.comments) : p.comments,
              replies: p.replies ? patch(p.replies) : p.replies,
            })),
          };
        }

        if (Array.isArray(old?.comments))
          return { ...old, comments: patch(old.comments) };

        if (Array.isArray(old?.replies))
          return { ...old, replies: patch(old.replies) };

        return old;
      });
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: keyComments.post(postId) });
    },
  });
}
