import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { usePostComments } from "../hooks/usePostComments";
import { useCreateComment } from "../hooks/useCreateComment";

function resolveCommentUser(comment: any) {
  const u =
    comment?.userId && typeof comment.userId === "object"
      ? comment.userId
      : (comment?.user ?? comment?.author ?? null);

  const username = u?.username ?? u?.name ?? u?.fullName ?? "unknown";
  return { username };
}

function normalizeComments(data: any) {
  if (!data) return { list: [], total: 0 };

  // các shape phổ biến
  if (Array.isArray(data)) {
    return { list: data, total: data.length };
  }

  if (Array.isArray(data?.comments)) {
    return {
      list: data.comments,
      total: Number(data.total ?? data.count ?? data.comments.length),
    };
  }

  if (Array.isArray(data?.data)) {
    return {
      list: data.data,
      total: Number(data.total ?? data.count ?? data.data.length),
    };
  }

  return { list: [], total: 0 };
}

export function CommentsInline({ postId }: { postId: string }) {
  const q = usePostComments(postId);
  const create = useCreateComment(postId);
  const [text, setText] = useState("");

  const { latest, totalCount } = useMemo(() => {
    const { list, total } = normalizeComments(q.data);

    // 👉 lấy comment gần nhất
    // backend thường trả newest-first → lấy [0]
    // nếu sau này bạn thấy ngược thì đổi sang list[list.length - 1]
    const latestComment = list[0] ?? null;

    return { latest: latestComment, totalCount: total };
  }, [q.data]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;

    create.mutate(value, {
      onSuccess: () => setText(""),
    });
  };

  return (
    <div className="border-t p-3">
      {/* View all comments */}
      <div className="mb-2">
        <Link
          to={`/p/${postId}`}
          className="text-sm opacity-70 hover:underline"
        >
          View all comments{totalCount ? ` (${totalCount})` : ""}
        </Link>
      </div>

      {/* Latest comment */}
      {q.isLoading ? (
        <div className="text-sm opacity-70">Loading comments...</div>
      ) : q.isError ? (
        <div className="text-sm">
          Failed to load comments.{" "}
          <button className="underline" onClick={() => q.refetch()}>
            Retry
          </button>
        </div>
      ) : latest ? (
        <div className="text-sm">
          <b>{resolveCommentUser(latest).username}:</b>{" "}
          {latest?.content ?? latest?.text ?? ""}
        </div>
      ) : (
        <div className="text-sm opacity-70">No comments yet.</div>
      )}

      {/* Input */}
      <form onSubmit={submit} className="flex gap-2 mt-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded px-3 py-2 text-sm"
          placeholder="Add a comment..."
        />
        <button
          type="submit"
          disabled={create.isPending}
          className="px-3 py-2 rounded bg-black text-white text-sm disabled:opacity-60"
        >
          {create.isPending ? "..." : "Post"}
        </button>
      </form>
    </div>
  );
}
