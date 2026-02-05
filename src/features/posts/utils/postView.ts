export function getPostId(p: any) {
  return p?._id ?? p?.id ?? p?.postId;
}

export function getAuthor(p: any) {
  return p?.author ?? p?.user ?? p?.createdBy ?? {};
}

export function getMediaList(p: any): any[] {
  // hỗ trợ nhiều kiểu data
  if (Array.isArray(p?.media)) return p.media;
  if (Array.isArray(p?.images))
    return p.images.map((url: string) => ({ url, type: "image" }));
  if (p?.image) return [{ url: p.image, type: "image" }];
  if (p?.thumbnail) return [{ url: p.thumbnail, type: "image" }];
  return [];
}

export function getMediaUrl(m: any) {
  if (!m) return "";
  if (typeof m === "string") return m;
  return m.url ?? m.secure_url ?? m.thumbnailUrl ?? "";
}

export function getMediaType(m: any) {
  if (!m) return "image";
  const t = (typeof m === "string" ? "" : m.type) ?? "";
  if (String(t).includes("video")) return "video";
  return "image";
}
