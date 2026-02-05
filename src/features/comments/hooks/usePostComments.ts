import { useInfiniteQuery } from "@tanstack/react-query";
import { commentsApi } from "../api/comments.api";
import { keyComments } from "./keyComments";

type Params = {
  limit?: number;
};

export function usePostComments(postId: string, params: Params = {}) {
  const limit = params.limit ?? 10;

  return useInfiniteQuery({
    queryKey: keyComments.list(postId, { limit }),
    enabled: Boolean(postId),
    initialPageParam: 0, // offset
    queryFn: async ({ pageParam }) => {
      const data = await commentsApi.getPostComments(postId, {
        limit,
        offset: pageParam as number,
      });

      return {
        ...data,
        _offset: pageParam as number,
        _limit: limit,
      };
    },
    getNextPageParam: (lastPage: any) => {
      // backend của bạn có pagination.hasMore
      if (!lastPage?.pagination?.hasMore) return undefined;
      return (lastPage._offset ?? 0) + (lastPage._limit ?? limit);
    },
  });
}
