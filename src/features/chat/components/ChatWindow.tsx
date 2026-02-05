import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";

type Props = {
  conversation?: any;
  messages: any[];
  currentUserId: string;
  recipientId?: string;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  onSendText: (args: {
    recipientId: string;
    content: string;
  }) => void | Promise<any>;
  onSendImage?: (args: {
    recipientId: string;
    image: File;
  }) => void | Promise<any>;
  disabled?: boolean;
};

export function ChatWindow({
  conversation,
  messages,
  currentUserId,
  recipientId,
  hasMore,
  onLoadMore,
  isLoadingMore,
  onSendText,
  onSendImage,
  disabled,
}: Props) {
  const title =
    conversation?.participants?.find((p: any) => p?._id !== currentUserId)
      ?.username ??
    conversation?.participants?.[0]?.username ??
    "Messages";

  if (!conversation) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-gray-500">
        Select a conversation
      </div>
    );
  }

  const isInputDisabled = disabled || !recipientId;

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* header */}
      <div className="h-12 shrink-0 border-b px-4 flex items-center font-medium">
        {title}
      </div>

      {/* messages scroll area */}
      <div className="flex-1 min-h-0">
        <MessageList
          messages={messages}
          currentUserId={currentUserId}
          hasMore={hasMore}
          onLoadMore={onLoadMore}
          isLoadingMore={isLoadingMore}
        />
      </div>

      {/* input always at bottom */}
      <div className="shrink-0">
        <ChatInput
          disabled={isInputDisabled}
          onSendText={(text) => {
            if (!recipientId) return;
            return onSendText({ recipientId, content: text });
          }}
          onSendImage={
            onSendImage
              ? (file) => {
                  if (!recipientId) return;
                  return onSendImage({ recipientId, image: file });
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}
