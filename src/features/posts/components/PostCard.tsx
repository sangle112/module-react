import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle } from "lucide-react";
import { PostMedia } from "./PostMedia";
import { CommentsInline } from "@/features/comments/components/CommentsInline";
import { useToggleLikePost } from "../hooks/useToggleLikePost";
import { useAuth } from "@/app/providers/AuthProvider";

function resolveAuthorFromPost(post: any) {
  const u =
    (post?.user && typeof post.user === "object" && post.user) ||
    (post?.author && typeof post.author === "object" && post.author) ||
    (post?.userId && typeof post.userId === "object" && post.userId) ||
    null;

  const authorId = u?._id ?? u?.id ?? post?.userId ?? post?.authorId ?? null;

  const username = u?.username ?? u?.name ?? u?.fullName ?? "";

  const avatar =
    u?.profilePicture ?? u?.avatar ?? u?.photoUrl ?? u?.photo ?? "";

  return { authorId, username, avatar };
}

function getPostId(post: any) {
  return post?._id ?? post?.id ?? post?.postId;
}

function getLikesCount(post: any) {
  return Number(
    post?.likesCount ?? post?.likeCount ?? post?.likes ?? post?.totalLikes ?? 0,
  );
}

export function PostCard({ post }: { post: any }) {
  const { user } = useAuth();
  const myId = (user as any)?._id ?? (user as any)?.id ?? (user as any)?.userId;

  const toggleLike = useToggleLikePost();
  const postId = getPostId(post);

  const author = useMemo(() => resolveAuthorFromPost(post), [post]);

  const isMe = Boolean(
    myId && author.authorId && String(myId) === String(author.authorId),
  );
  const profileHref = author.authorId
    ? isMe
      ? "/profile"
      : `/users/${author.authorId}`
    : null;

  const isLiked = Boolean(post?.isLiked);
  const likesCount = getLikesCount(post);

  return (
    <div className="border rounded-xl overflow-hidden bg-white">
      {/* header */}
      <div className="p-3 flex items-center gap-2">
        {profileHref ? (
          <Link to={profileHref} className="flex items-center gap-2">
            <img
              src={author.avatar || "/avatar-default.png"}
              className="h-8 w-8 rounded-full object-cover bg-black/5"
              alt=""
            />
            <div className="text-sm font-medium hover:underline">
              {author.username}
            </div>
          </Link>
        ) : (
          <>
            <img
              src={author.avatar || "/avatar-default.png"}
              className="h-8 w-8 rounded-full object-cover bg-black/5"
              alt=""
            />
            <div className="text-sm font-medium">{author.username}</div>
          </>
        )}
      </div>

      {/* media */}
      <PostMedia post={post} />

      {/* actions */}
      <div className="p-3">
        <div className="flex items-center gap-5">
          {/* Like icon */}
          <button
            onClick={() => toggleLike.mutate(post)}
            disabled={toggleLike.isPending}
            className="flex items-center gap-2"
            aria-label="Like"
            title="Like"
            type="button"
          >
            <Heart className={isLiked ? "fill-red-500 text-red-500" : ""} />
            <span className="text-sm">{likesCount}</span>
          </button>

          {/* Comment icon -> đi detail */}
          {postId ? (
            <Link
              to={`/p/${postId}`}
              className="flex items-center gap-2"
              aria-label="Comments"
              title="Comments"
            >
              <MessageCircle />
            </Link>
          ) : (
            <div className="flex items-center gap-2 opacity-50">
              <MessageCircle />
            </div>
          )}
        </div>

        {post?.caption && (
          <div className="mt-2 text-sm whitespace-pre-wrap">{post.caption}</div>
        )}
      </div>

      {/*  inline comments: 1 comment + input + view all */}
      {postId && <CommentsInline postId={postId} />}
    </div>
  );
}
