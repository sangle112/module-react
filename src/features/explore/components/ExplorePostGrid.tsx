import type { Post } from "@/shared/types/post";
import { ExplorePostCard } from "./ExplorePostCard";

export function ExplorePostGrid({ posts }: { posts: Post[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
      {posts.map((p) => (
        <ExplorePostCard key={p._id} post={p} />
      ))}
    </div>
  );
}
