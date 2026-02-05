import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/app/providers/SocketProvider";
import { keyComments } from "./keyComments";

const getId = (x: any) => x?._id ?? x?.id;

const mergeComment = (oldItem: any, incoming: any) => {
  const likes =
    incoming?.likes ??
    incoming?.likesCount ??
    oldItem?.likes ??
    oldItem?.likesCount ??
    0;

  return {
    ...oldItem,
    ...incoming,
    likes,
    likesCount: likes,
    isLiked: incoming?.isLiked ?? oldItem?.isLiked,
  };
};

export function useCommentsRealtime(postId: string) {
  const qc = useQueryClient();
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    // ✅ guard tuyệt đối: không socket => không làm gì => không crash
    if (!postId || !socket || !isConnected) return;

    const onUpdated = (incoming: any) => {
      qc.setQueriesData({ queryKey: keyComments.post(postId) }, (old: any) => {
        if (!old) return old;

        const patchArr = (arr: any[]) =>
          arr.map((c) =>
            getId(c) === getId(incoming) ? mergeComment(c, incoming) : c,
          );

        if (old?.pages) {
          return {
            ...old,
            pages: old.pages.map((p: any) => ({
              ...p,
              comments: Array.isArray(p?.comments)
                ? patchArr(p.comments)
                : p?.comments,
              replies: Array.isArray(p?.replies)
                ? patchArr(p.replies)
                : p?.replies,
            })),
          };
        }

        if (Array.isArray(old?.comments))
          return { ...old, comments: patchArr(old.comments) };
        if (Array.isArray(old?.replies))
          return { ...old, replies: patchArr(old.replies) };
        return old;
      });
    };

    // (optional) created/deleted: cứ invalidate để chắc chắn đúng
    const onCreated = () => {
      qc.invalidateQueries({ queryKey: keyComments.post(postId) });
    };

    const onDeleted = () => {
      qc.invalidateQueries({ queryKey: keyComments.post(postId) });
    };

    socket.on("COMMENT_UPDATED", onUpdated);
    socket.on("COMMENT_CREATED", onCreated);
    socket.on("COMMENT_DELETED", onDeleted);

    return () => {
      socket.off("COMMENT_UPDATED", onUpdated);
      socket.off("COMMENT_CREATED", onCreated);
      socket.off("COMMENT_DELETED", onDeleted);
    };
  }, [postId, socket, isConnected, qc]);
}
