import { useMemo, useState } from "react";
import { useReplies } from "../hooks/useReplies";
import { useReplyComment } from "../hooks/useReplyComment";
import { CommentItem } from "./CommentItem";

export function ReplyList({
  postId,
  parentCommentId,
}: {
  postId: string;
  parentCommentId: string;
}) {
  const q = useReplies(postId, parentCommentId, 10);
  const reply = useReplyComment(postId, parentCommentId);

  const [text, setText] = useState("");

  const replies = useMemo(() => {
    const pages = q.data?.pages ?? [];
    return pages.flatMap((p: any) => p.replies ?? []);
  }, [q.data]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = text.trim();
    if (!v) return;
    reply.mutate(v, { onSuccess: () => setText("") });
  };

  return (
    <div className="ml-10 mt-2 space-y-2">
      {q.isLoading ? (
        <div className="text-xs opacity-70">Loading replies...</div>
      ) : (
        replies.map((r: any) => (
          <CommentItem
            key={r._id ?? r.id}
            comment={r}
            postId={postId}
            isReply
            parentCommentId={parentCommentId}
          />
        ))
      )}

      {q.hasNextPage && (
        <button
          className="text-xs opacity-70 hover:underline"
          disabled={q.isFetchingNextPage}
          onClick={() => q.fetchNextPage()}
          type="button"
        >
          {q.isFetchingNextPage ? "Loading..." : "Load more replies"}
        </button>
      )}

      <form onSubmit={submit} className="flex gap-2 pt-2">
        <input
          className="flex-1 border rounded px-2 py-1 text-xs"
          placeholder="Reply..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="text-xs px-2 py-1 rounded bg-black text-white disabled:opacity-60"
          disabled={reply.isPending}
        >
          {reply.isPending ? "..." : "Post"}
        </button>
      </form>
    </div>
  );
}
