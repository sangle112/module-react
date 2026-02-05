import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "@/features/chat/api/chat.api";
import { chatQueryKeys } from "./useConversations";
import type { Conversation } from "@/shared/types/chat";

export function useCreateConversation() {
  const qc = useQueryClient();

  return useMutation<Conversation, unknown, { userId: string }>({
    mutationFn: ({ userId }) => chatApi.createOrGetConversation(userId),
    onSuccess: () => {
      // Sau khi tạo/get conversation thì refresh list
      qc.invalidateQueries({ queryKey: chatQueryKeys.all });
    },
  });
}
