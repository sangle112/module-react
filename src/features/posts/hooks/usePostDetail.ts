import { useQuery } from "@tanstack/react-query";
import { http } from "@/shared/lib/http";
import { postKeys } from "./postKeys";

function unwrap<T>(res: any): T {
  if (!res) return res as T;
  if (res.data?.data) return res.data.data as T;
  if (res.data) return res.data as T;
  return res as T;
}

export function usePostDetail(postId?: string) {
  return useQuery({
    queryKey: postId ? postKeys.detail(postId) : ["posts", "detail", "unknown"],
    enabled: Boolean(postId),
    queryFn: async () => {
      const res = await http.get(`/posts/${postId}`);
      return unwrap<any>(res);
    },
  });
}
