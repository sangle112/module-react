import { useMemo } from "react";
import { usePostComments } from "../hooks/usePostComments";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { CommentItem } from "./CommentItem";

const COMMENTS_LIMIT = 10;

export function CommentList({ postId }: { postId: string }) {
  const q = usePostComments(postId, { limit: COMMENTS_LIMIT });

  const comments = useMemo(() => {
    const pages = q.data?.pages ?? [];
    const list = pages.flatMap((p: any) => p.comments ?? []);
    return list.filter((c: any) => !c?.parentCommentId);
  }, [q.data]);

  useInfiniteScroll({
    enabled: Boolean(q.hasNextPage) && !q.isFetchingNextPage,
    onLoadMore: () => {
      if (q.hasNextPage && !q.isFetchingNextPage) q.fetchNextPage();
    },
    sentinelId: "comments-sentinel",
    rootMargin: "600px",
  });

  if (q.isLoading)
    return <div className="p-4 text-sm">Loading comments...</div>;

  if (q.isError) {
    return (
      <div className="p-4 text-sm">
        Failed to load comments.{" "}
        <button className="underline" onClick={() => q.refetch()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {comments.map((c: any) => (
        <CommentItem key={c._id ?? c.id} postId={postId} comment={c} />
      ))}

      <div id="comments-sentinel" className="h-1" />

      {q.isFetchingNextPage && (
        <div className="p-3 text-center text-xs opacity-70">Loading...</div>
      )}

      {!q.hasNextPage && comments.length > 0 && (
        <div className="p-3 text-center text-xs opacity-60">End</div>
      )}
    </div>
  );
}
