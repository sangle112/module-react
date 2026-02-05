import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentsApi } from "../api/comments.api";
import { keyComments } from "./keyComments";

function getId(x: any) {
  return x?._id ?? x?.id;
}

export function useDeleteComment(postId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      commentId: string;
      parentCommentId?: string | null;
    }) => {
      if (payload.parentCommentId) {
        await commentsApi.deleteReply(
          postId,
          payload.parentCommentId,
          payload.commentId,
        );
        return payload;
      }

      await commentsApi.deleteComment(postId, payload.commentId);
      return payload;
    },

    onSuccess: ({ commentId, parentCommentId }) => {
      qc.setQueriesData({ queryKey: keyComments.post(postId) }, (old: any) => {
        if (!old) return old;

        const remove = (arr: any[]) =>
          arr.filter((c) => getId(c) !== commentId);

        if (old?.pages) {
          return {
            ...old,
            pages: old.pages.map((p: any) => {
              const next: any = { ...p };

              if (p.comments) next.comments = remove(p.comments);
              if (p.replies) next.replies = remove(p.replies);

              // nếu xoá reply → giảm repliesCount
              if (parentCommentId && next.comments) {
                next.comments = next.comments.map((c: any) =>
                  getId(c) === parentCommentId
                    ? {
                        ...c,
                        repliesCount: Math.max(
                          0,
                          Number(c.repliesCount ?? 0) - 1,
                        ),
                      }
                    : c,
                );
              }

              return next;
            }),
          };
        }

        if (Array.isArray(old?.comments))
          return { ...old, comments: remove(old.comments) };

        if (Array.isArray(old?.replies))
          return { ...old, replies: remove(old.replies) };

        return old;
      });
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: keyComments.post(postId) });
    },
  });
}
