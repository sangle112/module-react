import { useMemo, useState } from "react";
import type { Comment } from "@/shared/types/comment";
import type { FormEvent } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { ReplyList } from "./ReplyList";
import { useReplyComment } from "../hooks/useReplyComment";
import { useUpdateComment } from "../hooks/useUpdateComment";
import { useDeleteComment } from "../hooks/useDeleteComment";
import { useToggleLikeComment } from "../hooks/useToggleLikeComment";

type Props = {
  comment: Comment & any;
  postId: string;
  isReply?: boolean;
  parentCommentId?: string | null;
};

function getId(x: any) {
  return x?._id ?? x?.id ?? x?.commentId ?? x?.replyId;
}

export function CommentItem({
  comment,
  postId,
  isReply,
  parentCommentId,
}: Props) {
  const id = getId(comment);

  const username =
    comment?.userId?.username ??
    comment?.userId?.name ??
    comment?.user?.username ??
    comment?.user?.name ??
    comment?.author?.username ??
    "unknown";
  console.log("isReply:", isReply, "raw:", comment, "resolvedId:", id);
  const initials = useMemo(
    () => username.slice(0, 2).toUpperCase(),
    [username],
  );

  const likesCount = Number(
    comment.likesCount ?? comment.likeCount ?? comment.likes ?? 0,
  );
  const isLiked = Boolean(comment.isLiked);

  const toggleLike = useToggleLikeComment(postId);
  const update = useUpdateComment(postId);
  const del = useDeleteComment(postId);

  const [isEditing, setEditing] = useState(false);
  const [value, setValue] = useState(String(comment.content ?? ""));
  const [showReplies, setShowReplies] = useState(false);

  const reply = useReplyComment(postId, id);
  const [replyText, setReplyText] = useState("");

  const onSave = () => {
    const v = value.trim();
    if (!v) return;
    update.mutate(
      {
        commentId: id,
        content: v,
        parentCommentId: isReply ? (parentCommentId ?? null) : null,
      },
      { onSuccess: () => setEditing(false) },
    );
  };

  const onDelete = () => {
    del.mutate({
      commentId: id,
      parentCommentId: isReply ? (parentCommentId ?? null) : null,
    });
  };

  const onReply = (e: FormEvent) => {
    e.preventDefault();
    const v = replyText.trim();
    if (!v) return;
    reply.mutate(v, {
      onSuccess: () => {
        setReplyText("");
        setShowReplies(true);
      },
    });
  };

  return (
    <div className="flex gap-3">
      <div className="h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs">
        {initials}
      </div>

      <div className="flex-1">
        <div className="text-sm">
          <span className="font-semibold mr-2">{username}</span>

          {!isEditing ? (
            <span>{String(comment.content ?? "")}</span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <input
                className="border rounded px-2 py-1 text-sm w-[260px]"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              <button
                className="text-sm underline"
                onClick={onSave}
                type="button"
              >
                Save
              </button>
              <button
                className="text-sm underline"
                onClick={() => {
                  setEditing(false);
                  setValue(String(comment.content ?? ""));
                }}
                type="button"
              >
                Cancel
              </button>
            </span>
          )}
        </div>

        <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
          <button
            type="button"
            className="inline-flex items-center gap-1 hover:opacity-80"
            onClick={() => toggleLike.mutate({ commentId: id, isLiked })}
            disabled={toggleLike.isPending}
            title="Like"
          >
            <Heart
              className={isLiked ? "fill-red-500 text-red-500" : ""}
              size={16}
            />
            <span>{likesCount}</span>
          </button>

          {!isReply && (
            <button
              type="button"
              className="inline-flex items-center gap-1 hover:opacity-80"
              onClick={() => setShowReplies((v) => !v)}
              title="Replies"
            >
              <MessageCircle size={16} />
              <span>{comment.repliesCount ?? 0}</span>
            </button>
          )}

          <button
            type="button"
            className="hover:underline"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>

          <button type="button" className="hover:underline" onClick={onDelete}>
            Delete
          </button>
        </div>

        {!isReply && (
          <form onSubmit={onReply} className="mt-2 flex gap-2">
            <input
              className="flex-1 border rounded px-2 py-1 text-xs"
              placeholder="Reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <button
              className="text-xs px-2 py-1 rounded bg-black text-white disabled:opacity-60"
              disabled={reply.isPending}
            >
              {reply.isPending ? "..." : "Post"}
            </button>
          </form>
        )}

        {!isReply && showReplies && (
          <ReplyList postId={postId} parentCommentId={id} />
        )}
      </div>
    </div>
  );
}
