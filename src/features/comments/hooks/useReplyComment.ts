import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentsApi } from "../api/comments.api";
import { keyComments } from "./keyComments";

function makeTempId() {
  return `temp_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function useReplyComment(postId: string, parentCommentId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      return commentsApi.createReply(postId, parentCommentId, { content });
    },

    onMutate: async (content) => {
      const tempId = makeTempId();
      await qc.cancelQueries({ queryKey: keyComments.post(postId) });

      const tempReply = {
        _id: tempId,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: null,
        likes: 0,
        parentCommentId,
        _optimistic: true,
      };

      // insert vào replies page 0
      qc.setQueryData(
        keyComments.replies(postId, parentCommentId, { limit: 10 }),
        (old: any) => {
          if (!old) return old;
          if (old?.pages) {
            const first = old.pages[0];
            const firstReplies = first?.replies ?? [];
            const patchedFirst = {
              ...first,
              replies: [tempReply, ...firstReplies],
            };
            return { ...old, pages: [patchedFirst, ...old.pages.slice(1)] };
          }
          return old;
        },
      );

      // tăng repliesCount của parent trong comments list
      qc.setQueriesData({ queryKey: keyComments.post(postId) }, (old: any) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((p: any) => ({
            ...p,
            comments: (p.comments ?? []).map((c: any) =>
              (c._id ?? c.id) === parentCommentId
                ? { ...c, repliesCount: Number(c.repliesCount ?? 0) + 1 }
                : c,
            ),
          })),
        };
      });

      return { tempId };
    },

    onSuccess: (serverReply, _content, ctx) => {
      if (!ctx) return;
      qc.setQueryData(
        keyComments.replies(postId, parentCommentId, { limit: 10 }),
        (old: any) => {
          if (!old?.pages) return old;
          return {
            ...old,
            pages: old.pages.map((p: any) => ({
              ...p,
              replies: (p.replies ?? []).map((r: any) =>
                r._id === ctx.tempId ? serverReply : r,
              ),
            })),
          };
        },
      );
    },

    onError: () => {
      // fallback refetch
      qc.invalidateQueries({
        queryKey: keyComments.replies(postId, parentCommentId, { limit: 10 }),
      });
      qc.invalidateQueries({ queryKey: keyComments.post(postId) });
    },

    onSettled: () => {
      qc.invalidateQueries({
        queryKey: keyComments.replies(postId, parentCommentId, { limit: 10 }),
      });
    },
  });
}
