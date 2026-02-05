import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "@/shared/api/index";
import { profileKeys } from "./keys";

export function useUpdateMyProfile() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: profileApi.updateMyProfile,
    onSuccess: (me) => {
      qc.setQueryData(profileKeys.me(), me);
      // nếu có nơi nào cache user theo id trùng với me thì có thể sync thêm sau
    },
  });
}
