import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "@/shared/api/index";
import { profileKeys } from "./keys";

export function useFollowUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => profileApi.followUser(userId),
    onMutate: async (userId) => {
      await qc.cancelQueries({ queryKey: profileKeys.user(userId) });

      const prev = qc.getQueryData(profileKeys.user(userId));
      qc.setQueryData(profileKeys.user(userId), (old: any) => {
        if (!old) return old;
        const followersCount = (old.followersCount ?? 0) + 1;
        return { ...old, isFollowing: true, followersCount };
      });

      return { prev, userId };
    },
    onError: (_err, _userId, ctx) => {
      if (ctx?.prev) qc.setQueryData(profileKeys.user(ctx.userId), ctx.prev);
    },
    onSettled: (_d, _e, userId) => {
      qc.invalidateQueries({ queryKey: profileKeys.user(userId) });
    },
  });
}
