import { useInfiniteQuery } from "@tanstack/react-query";
import { commentsApi } from "../api/comments.api";
import { keyComments } from "./keyComments";

export function useReplies(postId: string, commentId: string, limit = 10) {
  return useInfiniteQuery({
    queryKey: keyComments.replies(postId, commentId, { limit }),
    enabled: Boolean(postId && commentId),
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const data = await commentsApi.getReplies(postId, commentId, {
        limit,
        offset: pageParam as number,
      });
      return { ...data, _offset: pageParam as number, _limit: limit };
    },
    getNextPageParam: (last: any) => {
      if (!last?.pagination?.hasMore) return undefined;
      return (last._offset ?? 0) + (last._limit ?? limit);
    },
  });
}
