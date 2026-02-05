import type { Message } from "@/shared/types/chat";
import { MessageItem } from "./MessageItem";

type Props = {
  messages: Message[];
  currentUserId: string;

  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
};

function getSenderId(m: any): string | undefined {
  // hỗ trợ cả object và string
  return m?.senderId?._id ?? m?.senderId ?? m?.from?._id ?? m?.from;
}

function getMessageId(m: any): string {
  return (m?._id ??
    m?.id ??
    `${m?.createdAt ?? ""}-${Math.random()}`) as string;
}

export function MessageList({
  messages,
  currentUserId,
  onLoadMore,
  hasMore,
  isLoadingMore,
}: Props) {
  return (
    <div className="h-full min-h-0 overflow-y-auto px-3 py-3 space-y-2">
      {hasMore && onLoadMore && (
        <div className="flex justify-center pb-2">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="text-xs px-3 py-1.5 rounded-lg border hover:bg-gray-50 disabled:opacity-60"
          >
            {isLoadingMore ? "Loading..." : "Load older messages"}
          </button>
        </div>
      )}

      {messages.map((m: any) => (
        <MessageItem
          key={getMessageId(m)}
          message={m}
          isMine={getSenderId(m) === currentUserId}
        />
      ))}

      {messages.length === 0 && (
        <p className="text-sm text-gray-500 py-6 text-center">
          No messages yet.
        </p>
      )}
    </div>
  );
}
