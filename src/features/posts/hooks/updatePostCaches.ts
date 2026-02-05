import type { QueryClient } from "@tanstack/react-query";
import { getPostId } from "../utils/postView";

type Patch = { isLiked?: boolean; likesCount?: number };

function updateList(list: any[], postId: string, patcher: (p: any) => any) {
  return list.map((p) => (getPostId(p) === postId ? patcher(p) : p));
}

export function patchPostEverywhere(
  qc: QueryClient,
  postId: string,
  patch: Patch,
) {
  const queries = qc.getQueryCache().findAll();

  for (const q of queries) {
    const key = q.queryKey;
    const data: any = qc.getQueryData(key);
    if (!data) continue;

    // detail object
    if (getPostId(data) === postId) {
      qc.setQueryData(key, { ...data, ...patch });
      continue;
    }

    // infinite pages
    if (data?.pages && Array.isArray(data.pages)) {
      qc.setQueryData(key, {
        ...data,
        pages: data.pages.map((page: any) => {
          if (Array.isArray(page?.posts)) {
            return {
              ...page,
              posts: updateList(page.posts, postId, (p) => ({
                ...p,
                ...patch,
              })),
            };
          }
          return page;
        }),
      });
      continue;
    }

    // { posts: [] }
    if (Array.isArray(data?.posts)) {
      qc.setQueryData(key, {
        ...data,
        posts: updateList(data.posts, postId, (p) => ({ ...p, ...patch })),
      });
      continue;
    }

    // list []
    if (Array.isArray(data)) {
      qc.setQueryData(
        key,
        updateList(data, postId, (p) => ({ ...p, ...patch })),
      );
    }
  }
}
