import { Link } from "react-router-dom";

type Props = {
  posts: any[];
};

export function PostsGrid({ posts }: Props) {
  if (!posts?.length) {
    return <div className="p-6 text-sm opacity-70">No posts yet.</div>;
  }

  return (
    <div className="grid grid-cols-3 gap-1 p-2">
      {posts.map((p: any) => {
        const postId = p._id ?? p.id ?? p.postId;
        const media = p.media?.[0] ?? p.images?.[0] ?? p.thumbnail ?? p.image;
        const isVideo =
          (p.media?.[0]?.type ?? p.type ?? "").toString().includes("video") ||
          Boolean(p.videoUrl);

        const thumb =
          typeof media === "string"
            ? media
            : (media?.url ?? media?.thumbnailUrl ?? media?.secure_url);

        return (
          <Link
            key={postId}
            to={`/p/${postId}`}
            className="relative block aspect-square bg-black/5 overflow-hidden"
            title="Open post"
          >
            {thumb ? (
              <img
                src={thumb}
                alt="post"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xs opacity-60">
                No media
              </div>
            )}

            {isVideo && (
              <div className="absolute top-1 right-1 rounded bg-black/60 text-white text-[10px] px-1.5 py-0.5">
                VIDEO
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}
