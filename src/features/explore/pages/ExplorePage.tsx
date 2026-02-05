import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Post } from "@/shared/types/post";

import { useExplorePosts } from "../hooks/useExplorePosts";
import { useSearchUsers } from "../hooks/useSearchUsers";
import { useSearchHistory } from "../hooks/useSearchHistory";

import { ExplorePostGrid } from "../components/ExplorePostGrid";
import { ExploreSearchBar } from "../components/ExploreSearchBar";
import { ExploreUserItem } from "../components/ExploreUserItem";
import { SearchHistoryList } from "../components/SearchHistoryList";

export function ExplorePage() {
  const [searchParams] = useSearchParams();
  const qFromUrl = (searchParams.get("q") ?? "").trim();

  const [q, setQ] = useState(qFromUrl);

  // sync state với URL (khi search từ AppHeader: /explore?q=...)
  useEffect(() => {
    setQ(qFromUrl);
  }, [qFromUrl]);

  const explore = useExplorePosts({ limit: 12 });
  const users = useSearchUsers(q);

  const { historyQuery, deleteItem, clearAll } = useSearchHistory(10);

  const posts: Post[] = useMemo(() => {
    const pages = explore.data?.pages ?? [];
    return pages.flatMap((p) => p?.posts ?? []);
  }, [explore.data]);

  const hasQuery = q.trim().length > 0;

  return (
    <div className="w-full max-w-5xl mx-auto p-3 md:p-6 space-y-4">
      <div className="flex items-center gap-3">
        <h1 className="text-lg md:text-xl font-semibold">Explore</h1>
        <div className="flex-1" />
      </div>

      {/* Search input riêng trong page (giữ lại cho UX) */}
      <ExploreSearchBar
        value={q}
        onChange={setQ}
        placeholder="Search users..."
      />

      {/* Search Results + History (nhưng KHÔNG ẩn grid posts) */}
      {hasQuery ? (
        <div className="grid md:grid-cols-2 gap-3">
          {/* Users results */}
          <div className="rounded-xl border bg-background overflow-hidden">
            <div className="px-3 py-2 border-b text-sm font-medium">
              Users
              {users.isFetching ? (
                <span className="ml-2 text-xs text-muted-foreground">
                  Searching...
                </span>
              ) : null}
            </div>

            <div className="p-2 space-y-1">
              {users.isLoading ? (
                <div className="text-sm text-muted-foreground px-2 py-2">
                  Loading...
                </div>
              ) : users.data?.length ? (
                users.data.map((u: any) => (
                  <ExploreUserItem key={u?._id || u?.id} user={u} />
                ))
              ) : (
                <div className="text-sm text-muted-foreground px-2 py-2">
                  No users found
                </div>
              )}
            </div>
          </div>

          {/* Recent searches */}
          <div className="space-y-3">
            <SearchHistoryList
              items={historyQuery.data ?? []}
              onDelete={(id) => deleteItem.mutate(id)}
              onClearAll={() => clearAll.mutate()}
              onPick={(qq) => setQ(qq)}
              isDeleting={deleteItem.isPending}
              isClearing={clearAll.isPending}
            />
          </div>
        </div>
      ) : (
        // Khi chưa search thì vẫn có history (IG-like)
        <SearchHistoryList
          items={historyQuery.data ?? []}
          onDelete={(id) => deleteItem.mutate(id)}
          onClearAll={() => clearAll.mutate()}
          onPick={(qq) => setQ(qq)}
          isDeleting={deleteItem.isPending}
          isClearing={clearAll.isPending}
        />
      )}

      {/* Explore posts luôn luôn hiển thị */}
      <div className="pt-2">
        {explore.isLoading ? (
          <div className="text-sm text-muted-foreground">
            Loading explore...
          </div>
        ) : (
          <ExplorePostGrid posts={posts} />
        )}

        <div className="flex justify-center pt-3">
          {explore.hasNextPage ? (
            <button
              onClick={() => explore.fetchNextPage()}
              disabled={explore.isFetchingNextPage}
              className="h-10 px-4 rounded-xl border hover:bg-accent transition disabled:opacity-50"
            >
              {explore.isFetchingNextPage ? "Loading..." : "Load more"}
            </button>
          ) : (
            <div className="text-xs text-muted-foreground">No more posts</div>
          )}
        </div>
      </div>
    </div>
  );
}
