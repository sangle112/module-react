import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentsApi } from "../api/comments.api";
import { keyComments } from "./keyComments";

const getId = (x: any) => x?._id ?? x?.id;

const getLikes = (x: any) =>
  Number(x?.likesCount ?? x?.likes ?? x?.likeCount ?? 0);

const patchLike = (item: any, nextIsLiked: boolean, nextLikes: number) => ({
  ...item,
  isLiked: nextIsLiked,
  likes: nextLikes,
  likesCount: nextLikes,
});

export function useToggleLikeComment(postId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      commentId,
      isLiked,
    }: {
      commentId: string;
      isLiked: boolean;
    }) => {
      // API của bạn trả { likes: number }
      const res = isLiked
        ? await commentsApi.unlikeComment(postId, commentId)
        : await commentsApi.likeComment(postId, commentId);

      return {
        commentId,
        nextIsLiked: !isLiked,
        likes: Number(res?.likes ?? 0),
      };
    },

    onMutate: async ({ commentId, isLiked }) => {
      await qc.cancelQueries({ queryKey: keyComments.post(postId) });

      const snapshots = qc.getQueriesData({
        queryKey: keyComments.post(postId),
      });

      const optimisticUpdate = (arr: any[]) =>
        arr.map((c) => {
          if (getId(c) !== commentId) return c;
          const base = getLikes(c);
          const nextLikes = Math.max(0, base + (isLiked ? -1 : 1));
          return patchLike(c, !isLiked, nextLikes);
        });

      snapshots.forEach(([qk, old]: any) => {
        if (!old) return;

        if (old?.pages) {
          qc.setQueryData(qk, {
            ...old,
            pages: old.pages.map((p: any) => ({
              ...p,
              comments: Array.isArray(p?.comments)
                ? optimisticUpdate(p.comments)
                : p?.comments,
              replies: Array.isArray(p?.replies)
                ? optimisticUpdate(p.replies)
                : p?.replies,
            })),
          });
          return;
        }

        if (Array.isArray(old?.comments)) {
          qc.setQueryData(qk, {
            ...old,
            comments: optimisticUpdate(old.comments),
          });
          return;
        }

        if (Array.isArray(old?.replies)) {
          qc.setQueryData(qk, {
            ...old,
            replies: optimisticUpdate(old.replies),
          });
          return;
        }
      });

      return { snapshots };
    },

    onError: (_err, _vars, ctx) => {
      ctx?.snapshots?.forEach(([qk, data]: any) => qc.setQueryData(qk, data));
    },

    onSuccess: ({ commentId, nextIsLiked, likes }) => {
      // ✅ server là nguồn chuẩn, patch lại toàn bộ cache
      qc.setQueriesData({ queryKey: keyComments.post(postId) }, (old: any) => {
        if (!old) return old;

        const apply = (arr: any[]) =>
          arr.map((c) =>
            getId(c) === commentId ? patchLike(c, nextIsLiked, likes) : c,
          );

        if (old?.pages) {
          return {
            ...old,
            pages: old.pages.map((p: any) => ({
              ...p,
              comments: Array.isArray(p?.comments)
                ? apply(p.comments)
                : p?.comments,
              replies: Array.isArray(p?.replies)
                ? apply(p.replies)
                : p?.replies,
            })),
          };
        }

        if (Array.isArray(old?.comments))
          return { ...old, comments: apply(old.comments) };
        if (Array.isArray(old?.replies))
          return { ...old, replies: apply(old.replies) };
        return old;
      });
    },

    // 🚫 Quan trọng: để tránh “refetch kéo data cũ => reset”
    // Nếu realtime của bạn đã sync tốt, có thể TẮT invalidate.
    onSettled: () => {
      // qc.invalidateQueries({ queryKey: keyComments.post(postId) });
    },
  });
}
