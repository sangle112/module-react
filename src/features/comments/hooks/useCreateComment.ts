import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentsApi } from "../api/comments.api";
import { keyComments } from "./keyComments";

function makeTempId() {
  return `temp_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function useCreateComment(postId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      return commentsApi.createComment(postId, { content });
    },

    onMutate: async (content) => {
      const tempId = makeTempId();

      await qc.cancelQueries({ queryKey: keyComments.post(postId) });

      const prev = qc.getQueryData(
        keyComments.list(postId, { limit: 10 }),
      ) as any;

      const tempComment = {
        _id: tempId,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: null, // UI sẽ resolve "unknown" nếu bạn không map current user
        likes: 0,
        repliesCount: 0,
        parentCommentId: null,
        _optimistic: true,
      };

      // insert vào đầu page 0 (newest-first)
      qc.setQueryData(keyComments.list(postId, { limit: 10 }), (old: any) => {
        if (!old) return old;

        if (old?.pages) {
          const first = old.pages[0];
          const firstComments = first?.comments ?? [];
          const patchedFirst = {
            ...first,
            comments: [tempComment, ...firstComments],
          };
          return {
            ...old,
            pages: [patchedFirst, ...old.pages.slice(1)],
          };
        }

        // nếu không infinite shape, fallback
        if (Array.isArray(old?.comments)) {
          return { ...old, comments: [tempComment, ...old.comments] };
        }

        return old;
      });

      return { prev, tempId };
    },

    onError: (_err, _content, ctx) => {
      // rollback
      if (!ctx) return;
      qc.setQueryData(keyComments.list(postId, { limit: 10 }), ctx.prev);
    },

    onSuccess: (serverComment, _content, ctx) => {
      // replace temp -> server
      if (!ctx) return;

      qc.setQueryData(keyComments.list(postId, { limit: 10 }), (old: any) => {
        if (!old) return old;

        const replace = (arr: any[]) =>
          arr.map((c) => (c?._id === ctx.tempId ? serverComment : c));

        if (old?.pages) {
          return {
            ...old,
            pages: old.pages.map((p: any) => ({
              ...p,
              comments: replace(p.comments ?? []),
            })),
          };
        }

        if (Array.isArray(old?.comments)) {
          return { ...old, comments: replace(old.comments) };
        }

        return old;
      });
    },

    onSettled: () => {
      // optional: refetch để server là source of truth (nhẹ, chỉ theo postId)
      qc.invalidateQueries({ queryKey: keyComments.post(postId) });
    },
  });
}
