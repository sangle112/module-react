import type { Conversation } from "@/shared/types/chat";
import { ChatItem } from "./ChatItem";

type Props = {
  conversations: Conversation[];
  currentUserId: string;
  activeConversationId?: string;
  onSelect: (conversation: Conversation) => void;

  // infinite helpers (optional)
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
};

export function ChatList({
  conversations,
  currentUserId,
  activeConversationId,
  onSelect,
  onLoadMore,
  hasMore,
  isLoadingMore,
}: Props) {
  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-2">
        <h2 className="text-lg font-semibold">Messages</h2>
      </div>

      <div className="flex-1 overflow-auto px-2 space-y-2">
        {conversations.map((c) => (
          <ChatItem
            key={c._id ?? c._id}
            conversation={c}
            currentUserId={currentUserId}
            active={c._id === activeConversationId}
            onClick={() => onSelect(c)}
          />
        ))}

        {conversations.length === 0 && (
          <p className="px-3 py-6 text-sm text-gray-500">No conversations.</p>
        )}

        {hasMore && onLoadMore && (
          <div className="py-3 flex justify-center">
            <button
              type="button"
              onClick={onLoadMore}
              disabled={isLoadingMore}
              className="text-sm px-3 py-2 rounded-lg border hover:bg-gray-50 disabled:opacity-60"
            >
              {isLoadingMore ? "Loading..." : "Load more"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
