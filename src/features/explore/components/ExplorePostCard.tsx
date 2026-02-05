import type { Post } from "@/shared/types/post";
import { Link } from "react-router-dom";

function formatCount(n: number) {
  if (n < 1000) return String(n);
  const k = n / 1000;
  return `${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}k`;
}

export function ExplorePostCard({ post }: { post: Post }) {
  const isVideo = post.mediaType === "video" || !!post.video;
  const src = isVideo ? post.video : post.image;

  return (
    <Link
      to={`/p/${post._id}`}
      className="group relative block overflow-hidden rounded-xl bg-muted"
    >
      {/* Media */}
      {src ? (
        isVideo ? (
          <video
            src={src}
            className="aspect-square h-full w-full object-cover"
            muted
            playsInline
            preload="metadata"
          />
        ) : (
          <img
            src={src}
            alt={post.caption ?? "post"}
            className="aspect-square h-full w-full object-cover"
            loading="lazy"
          />
        )
      ) : (
        <div className="aspect-square w-full grid place-items-center text-sm text-muted-foreground">
          No media
        </div>
      )}

      {/* Overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-black/45" />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-6 opacity-0 group-hover:opacity-100 transition">
        <div className="text-white text-sm font-semibold">
          ♥ {formatCount(post.likes)}
        </div>
        <div className="text-white text-sm font-semibold">
          💬 {formatCount(post.comments)}
        </div>
      </div>

      {/* Video badge */}
      {isVideo ? (
        <div className="absolute top-2 right-2 rounded-md bg-black/60 px-2 py-1 text-[11px] text-white">
          VIDEO
        </div>
      ) : null}
    </Link>
  );
}
