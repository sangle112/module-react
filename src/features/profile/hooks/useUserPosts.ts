import { useInfiniteQuery } from "@tanstack/react-query";
import { http } from "@/shared/lib/http";

export type ProfilePostsFilter = "all" | "video" | "saved";

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

type UserPostsResponse = {
  posts: any[];
  limit: number;
  offset: number;
  total?: number;
};

function unwrap<T>(res: any): T {
  // hỗ trợ cả 2 kiểu axios:
  // 1) res.data = { success, data }
  // 2) res.data = data (đã unwrap ở interceptor)
  if (!res) return res as T;
  if (res.data?.data) return res.data.data as T;
  if (res.data) return res.data as T;
  return res as T;
}

export function useUserPosts(
  userId?: string,
  filter: ProfilePostsFilter = "all",
  pageSize = 12,
) {
  return useInfiniteQuery({
    queryKey: ["userPosts", userId, filter, pageSize],
    enabled: Boolean(userId),
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const res = await http.get<ApiEnvelope<UserPostsResponse>>(
        `/posts/user/${userId}`,
        {
          params: {
            filter,
            limit: pageSize,
            offset: pageParam,
          },
        },
      );

      const data = unwrap<UserPostsResponse | any[]>(res);

      // normalize: nếu api trả trực tiếp array
      if (Array.isArray(data)) {
        return {
          posts: data,
          limit: pageSize,
          offset: pageParam,
          total: data.length,
        } as UserPostsResponse;
      }

      return data as UserPostsResponse;
    },
    getNextPageParam: (lastPage) => {
      const postsLen = lastPage?.posts?.length ?? 0;
      if (postsLen === 0) return undefined;

      const nextOffset = (lastPage.offset ?? 0) + (lastPage.limit ?? pageSize);

      // nếu có total thì chặn chuẩn
      if (typeof lastPage.total === "number" && nextOffset >= lastPage.total) {
        return undefined;
      }

      // nếu không có total: cứ dựa vào postsLen < limit để kết luận hết
      if (postsLen < (lastPage.limit ?? pageSize)) return undefined;

      return nextOffset;
    },
  });
}
