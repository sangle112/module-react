import { useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "@/shared/lib/http";
import { updatePostEverywhere } from "./updatePostCaches";

export function useUnlikePost() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const res = await http.delete(`/posts/${postId}/like`);
      return res;
    },
    onMutate: async (postId) => {
      await qc.cancelQueries();
      updatePostEverywhere(qc, postId, { isLiked: false });
      return { postId };
    },
    onSuccess: (_res, postId) => {
      qc.invalidateQueries({ queryKey: ["posts", "detail", postId] });
    },
    onError: (_err, postId) => {
      updatePostEverywhere(qc, postId, { isLiked: true });
    },
  });
}
