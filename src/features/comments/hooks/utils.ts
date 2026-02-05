export function resolveCommentUser(comment: any) {
  const u =
    comment?.userId && typeof comment.userId === "object"
      ? comment.userId
      : (comment?.user ?? comment?.author ?? null);

  return {
    id: u?._id ?? u?.id ?? null,
    username: u?.username ?? u?.name ?? u?.fullName ?? "unknown",
    avatar: u?.profilePicture ?? u?.avatar ?? u?.photoUrl ?? "",
  };
}

export function normalizeComments(data: any) {
  if (!data) return { list: [], total: 0 };

  if (Array.isArray(data)) return { list: data, total: data.length };

  if (Array.isArray(data?.comments)) {
    return {
      list: data.comments,
      total:
        Number(data.total ?? data.count ?? data.comments.length) ||
        data.comments.length,
    };
  }

  if (Array.isArray(data?.data)) {
    return {
      list: data.data,
      total:
        Number(data.total ?? data.count ?? data.data.length) ||
        data.data.length,
    };
  }

  return { list: [], total: 0 };
}
