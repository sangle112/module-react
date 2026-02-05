import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/shared/lib/http";
import { postKeys } from "./postKeys";

function getPostId(post: any) {
  return post?._id ?? post?.id ?? post?.postId;
}

function getLikesCount(post: any) {
  return Number(
    post?.likesCount ?? post?.likeCount ?? post?.likes ?? post?.totalLikes ?? 0,
  );
}

function getFeedKey() {
  const k: any = (postKeys as any).feed;
  return typeof k === "function" ? k() : k; // hỗ trợ feed là fn hoặc array
}

export function useToggleLikePost() {
  const qc = useQueryClient();
  const FEED_KEY = getFeedKey() ?? ["posts", "feed"];

  return useMutation({
    mutationFn: async (post: any) => {
      const postId = getPostId(post);
      if (!postId) throw new Error("Missing postId");

      // Like / Unlike
      if (post?.isLiked) {
        const res = await http.delete(`/posts/${postId}/like`);
        return res?.data?.data ?? res?.data ?? null;
      } else {
        const res = await http.post(`/posts/${postId}/like`);
        return res?.data?.data ?? res?.data ?? null;
      }
    },

    onMutate: async (post) => {
      const postId = getPostId(post);
      if (!postId) return;

      await qc.cancelQueries({ queryKey: FEED_KEY });

      const isLiked = Boolean(post?.isLiked);
      const current = getLikesCount(post);
      const next = isLiked ? Math.max(0, current - 1) : current + 1;

      qc.setQueriesData({ queryKey: FEED_KEY }, (old: any) => {
        if (!old) return old;

        const patchPost = (p: any) => {
          const id = getPostId(p);
          if (id !== postId) return p;
          return {
            ...p,
            isLiked: !isLiked,
            likesCount: next,
            likeCount: next,
            likes: next,
            totalLikes: next,
          };
        };

        // InfiniteQuery: { pages: [{ posts: [] }] }
        if (old?.pages) {
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              posts: page.posts?.map(patchPost),
            })),
          };
        }

        // { posts: [] }
        if (old?.posts) return { ...old, posts: old.posts.map(patchPost) };

        // [] list
        if (Array.isArray(old)) return old.map(patchPost);

        return old;
      });
    },

    onSuccess: (serverData) => {
      // nếu server trả về post updated / counts thì merge lại cache
      if (!serverData) return;

      const updated = serverData?.post ?? serverData;
      const postId = getPostId(updated);
      if (!postId) return;

      qc.setQueriesData({ queryKey: FEED_KEY }, (old: any) => {
        if (!old) return old;

        const mergePost = (p: any) => {
          const id = getPostId(p);
          if (id !== postId) return p;
          return { ...p, ...updated };
        };

        if (old?.pages) {
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              posts: page.posts?.map(mergePost),
            })),
          };
        }

        if (old?.posts) return { ...old, posts: old.posts.map(mergePost) };
        if (Array.isArray(old)) return old.map(mergePost);
        return old;
      });
    },

    onError: () => {
      // lỗi thì mới refetch
      qc.invalidateQueries({ queryKey: FEED_KEY });
    },
  });
}
