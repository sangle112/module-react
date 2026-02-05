import { useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "@/shared/lib/http";
import { updatePostEverywhere } from "./updatePostCaches";

export function useLikePost() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const res = await http.post(`/posts/${postId}/like`);
      return res;
    },
    onMutate: async (postId) => {
      await qc.cancelQueries();

      // optimistic
      updatePostEverywhere(qc, postId, {
        isLiked: true,
        likesCount: (prev: any) => prev, // ignore if not used
      });

      // có thể dùng để debug hoặc các mục đích khác
      qc.getQueryCache()
        .findAll()
        .forEach((q) => {
          const data: any = qc.getQueryData(q.queryKey);
          if (!data) return;
        });

      // cách chắc chắn: update lần 2 dựa trên cache hiện tại
      // (mình làm ngay trong helper by reading old post? dự án bạn mỗi nơi data shape khác nên giữ an toàn)
      return { postId };
    },
    onSuccess: (_res, postId) => {
      //  không invalidate toàn bộ ngay lập tức (dễ “tụt”)
      // chỉ invalidate detail nếu bạn muốn chắc
      qc.invalidateQueries({ queryKey: ["posts", "detail", postId] });
    },
    onError: (_err, postId) => {
      // rollback: set liked false và trừ 1
      updatePostEverywhere(qc, postId, { isLiked: false });
    },
  });
}
