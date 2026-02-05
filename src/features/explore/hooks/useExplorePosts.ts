import { useInfiniteQuery } from "@tanstack/react-query";
import { exploreApi, type ExploreQuery } from "../api/explore.api";

type Options = {
  limit?: number;
};

export function useExplorePosts(options: Options = {}) {
  const limit = options.limit ?? 12;

  return useInfiniteQuery({
    queryKey: ["explore-posts", { limit }],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      exploreApi.getExplorePosts({
        page: pageParam as number,
        limit,
      } satisfies ExploreQuery),
    getNextPageParam: (lastPage) => {
      if (lastPage?.pagination?.hasMore)
        return lastPage.pagination.currentPage + 1;
      return undefined;
    },
  });
}
