import { useMemo } from "react";

import { useFeed } from "../hooks/useFeed";
import { PostCard } from "../components/PostCard";
import { CreatePostBox } from "../components/CreatePostBox";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";

export function FeedPage() {
  const q = useFeed(10);

  const posts = useMemo(() => {
    const pages = q.data?.pages ?? [];
    return pages.flatMap((p) => p.posts ?? []);
  }, [q.data]);

  useInfiniteScroll({
    enabled: Boolean(q.hasNextPage) && !q.isFetchingNextPage,
    onLoadMore: () => {
      if (q.hasNextPage && !q.isFetchingNextPage) {
        q.fetchNextPage();
      }
    },
    sentinelId: "feed-sentinel",
    rootMargin: "600px",
  });

  return (
    <div className="max-w-xl mx-auto p-3 grid gap-3">
      <CreatePostBox />

      {q.isLoading ? (
        <div className="p-4 text-sm opacity-70">Loading feed...</div>
      ) : q.isError ? (
        <div className="p-4">
          <div className="text-sm mb-2">Load feed failed.</div>
          <button
            className="px-3 py-2 rounded border"
            onClick={() => q.refetch()}
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {posts.map((p: any) => (
            <PostCard key={p._id ?? p.id ?? p.postId} post={p} />
          ))}

          <div id="feed-sentinel" className="h-1" />

          <div className="flex justify-center py-4">
            {q.isFetchingNextPage ? (
              <div className="text-xs opacity-70">Loading...</div>
            ) : q.hasNextPage ? (
              <div className="text-xs opacity-60">Scroll to load more</div>
            ) : (
              <div className="text-xs opacity-60">End</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
