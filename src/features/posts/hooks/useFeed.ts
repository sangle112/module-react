import { useInfiniteQuery } from "@tanstack/react-query";
import { http } from "@/shared/lib/http";
import { postKeys } from "./postKeys";

type FeedPageData = {
  posts: any[];
  limit: number;
  offset: number;
  total?: number;
};

function unwrap<T>(res: any): T {
  if (!res) return res as T;
  if (res.data?.data) return res.data.data as T;
  if (res.data) return res.data as T;
  return res as T;
}

export function useFeed(limit = 10) {
  return useInfiniteQuery({
    queryKey: postKeys.feed(),
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const res = await http.get("/posts/feed", {
        params: { limit, offset: pageParam },
      });

      const data = unwrap<FeedPageData | any[]>(res);

      if (Array.isArray(data)) {
        return {
          posts: data,
          limit,
          offset: pageParam,
          // total: undefined
        } as FeedPageData;
      }

      return data as FeedPageData;
    },

    getNextPageParam: (last) => {
      const len = last.posts?.length ?? 0;

      if (len === 0) return undefined;
      if (len < (last.limit ?? limit)) return undefined;

      const nextOffset = (last.offset ?? 0) + (last.limit ?? limit);

      if (typeof last.total === "number" && nextOffset >= last.total) {
        return undefined;
      }

      return nextOffset;
    },
  });
}
