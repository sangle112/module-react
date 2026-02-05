import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "@/shared/api/index";
import { profileKeys } from "./keys";

export function useDeleteProfilePicture() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: profileApi.deleteProfilePicture,
    onSuccess: () => {
      // cập nhật UI ngay
      qc.setQueryData(profileKeys.me(), (prev: any) =>
        prev ? { ...prev, profilePicture: undefined } : prev,
      );
    },
  });
}
