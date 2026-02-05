import { CommentComposer } from "../components/CommentComposer";
import { CommentList } from "../components/CommentList";
import { useCommentsRealtime } from "../hooks/useCommentsRealtime";

export function PostCommentsSection({ postId }: { postId: string }) {
  useCommentsRealtime(postId);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <CommentList postId={postId} />
      </div>

      <div className="border-t">
        <CommentComposer postId={postId} />
      </div>
    </div>
  );
}
