import { useParams } from "react-router-dom";
import { usePostDetail } from "../hooks/usePostDetail";
import { PostCommentsSection } from "@/features/comments/pages/PostCommentsSection";
import { PostMedia } from "../components/PostMedia";

export function PostDetailPage() {
  const { postId } = useParams();
  const q = usePostDetail(postId);

  if (q.isLoading) return <div className="p-4">Loading...</div>;
  if (q.isError) return <div className="p-4">Load post failed.</div>;
  if (!q.data) return <div className="p-4">No post.</div>;

  const post = q.data;

  return (
    <div className="mx-auto max-w-5xl p-3">
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* LEFT: Media */}
          <div className="bg-black/5">
            <PostMedia post={post} />
          </div>

          {/* RIGHT: Caption + Comments */}
          <div className="flex flex-col min-h-[520px]">
            {/* caption (sticky top trong cột comments) */}
            <div className="p-4 border-b">
              {post?.caption ? (
                <div className="text-sm whitespace-pre-wrap">
                  {post.caption}
                </div>
              ) : (
                <div className="text-sm opacity-60">No caption</div>
              )}
            </div>

            {/* comments section scrollable */}
            <div className="flex-1 overflow-auto">
              {postId && <PostCommentsSection postId={postId} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
