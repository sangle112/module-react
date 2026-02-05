import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "@/features/chat/api/chat.api";
import type {
  Message,
  SendTextMessagePayload,
  SendImageMessagePayload,
} from "@/shared/types/chat";
import { messageQueryKeys } from "./useMessages";
import { chatQueryKeys } from "./useConversations";

type UseSendMessageParams = {
  conversationId: string;
  limit?: number; // để match queryKey useMessages
};

export function useSendMessage(params: UseSendMessageParams) {
  const qc = useQueryClient();
  const limit = params.limit ?? 20;
  const conversationId = params.conversationId;

  const invalidate = async () => {
    // refresh messages của conversation hiện tại
    await qc.invalidateQueries({
      queryKey: messageQueryKeys.messages(conversationId, limit),
    });

    // refresh list conversation (để lastMessage update)
    await qc.invalidateQueries({ queryKey: chatQueryKeys.all });
  };

  const sendTextMutation = useMutation<
    Message,
    unknown,
    Omit<SendTextMessagePayload, "conversationId">
  >({
    mutationFn: (payload) =>
      chatApi.sendTextMessage({
        conversationId,
        recipientId: payload.recipientId,
        content: payload.content,
      }),
    onSuccess: invalidate,
  });

  const sendImageMutation = useMutation<
    Message,
    unknown,
    Omit<SendImageMessagePayload, "conversationId">
  >({
    mutationFn: (payload) =>
      chatApi.sendImageMessage({
        conversationId,
        recipientId: payload.recipientId,
        image: payload.image,
      }),
    onSuccess: invalidate,
  });

  return {
    // actions
    sendText: (args: { recipientId: string; content: string }) =>
      sendTextMutation.mutateAsync(args),

    sendImage: (args: { recipientId: string; image: File }) =>
      sendImageMutation.mutateAsync(args),

    // states
    isSending: sendTextMutation.isPending || sendImageMutation.isPending,
    isSendingText: sendTextMutation.isPending,
    isSendingImage: sendImageMutation.isPending,
    error: sendTextMutation.error ?? sendImageMutation.error,
  };
}
