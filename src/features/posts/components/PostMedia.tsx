function toArray(v: any) {
  return Array.isArray(v) ? v : v ? [v] : [];
}

function getMediaList(post: any) {
  // các shape phổ biến: media[], images[], image, video, file, thumbnail...
  if (Array.isArray(post?.media)) return post.media;
  if (Array.isArray(post?.images))
    return post.images.map((url: string) => ({ url, type: "image" }));
  if (post?.image) return [{ url: post.image, type: "image" }];
  if (post?.video) return [{ url: post.video, type: "video" }];
  if (post?.file) return [{ url: post.file, type: "auto" }];
  if (post?.thumbnail) return [{ url: post.thumbnail, type: "image" }];
  return [];
}

function getUrl(m: any) {
  if (!m) return "";
  if (typeof m === "string") return m;
  return m.url ?? m.secure_url ?? m.path ?? m.src ?? m.thumbnailUrl ?? "";
}

function inferTypeFromUrl(url: string) {
  const u = url.toLowerCase();
  if (
    u.endsWith(".mp4") ||
    u.includes(".mp4?") ||
    u.endsWith(".webm") ||
    u.includes(".webm?")
  )
    return "video";
  if (
    u.endsWith(".mov") ||
    u.includes(".mov?") ||
    u.endsWith(".m4v") ||
    u.includes(".m4v?")
  )
    return "video";
  return "image";
}

function getType(m: any) {
  if (!m) return "image";
  const t =
    typeof m === "string" ? "" : (m.type ?? m.mimeType ?? m.mimetype ?? "");
  const ts = String(t).toLowerCase();
  if (ts.includes("video")) return "video";
  if (ts.includes("image")) return "image";
  const url = getUrl(m);
  return inferTypeFromUrl(url);
}

export function PostMedia({ post }: { post: any }) {
  const media = getMediaList(post);
  const list = toArray(media);

  if (!list.length) {
    return (
      <div className="p-10 text-center text-sm opacity-60 bg-black/5">
        No media
      </div>
    );
  }

  // Feed: hiển thị media đầu tiên (Instagram-like)
  const first = list[0];
  const url = getUrl(first);
  const type = getType(first);

  if (!url) {
    return (
      <div className="p-10 text-center text-sm opacity-60 bg-black/5">
        Invalid media
      </div>
    );
  }

  return (
    <div className="bg-black/5">
      {type === "video" ? (
        <video
          controls
          playsInline
          className="w-full max-h-[560px] object-contain bg-black"
        >
          <source src={url} />
        </video>
      ) : (
        <img src={url} className="w-full object-cover" alt="" />
      )}

      {list.length > 1 && (
        <div className="p-2 text-xs opacity-70">+ {list.length - 1} more</div>
      )}
    </div>
  );
}
