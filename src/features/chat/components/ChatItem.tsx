import type { Conversation } from "@/shared/types/chat";

type Props = {
  conversation: Conversation & { id?: string; _id?: string };
  currentUserId: string;
  active?: boolean;
  onClick?: () => void;
};

function getAvatar(u: any) {
  return u?.avatar ?? u?.profilePicture ?? u?.photo ?? "";
}

export function ChatItem({
  conversation,
  currentUserId,
  active,
  onClick,
}: Props) {
  const other =
    (conversation as any).participants?.find(
      (p: any) => p._id !== currentUserId,
    ) ?? (conversation as any).participants?.[0];

  const last: any = (conversation as any).lastMessage;

  const preview =
    last?.messageType === "image" ? "📷 Photo" : (last?.content ?? "");

  const avatarUrl = getAvatar(other);

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full text-left px-3 py-2 rounded-xl border",
        active ? "border-black" : "border-transparent hover:border-gray-200",
        "hover:bg-gray-50 transition",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={other?.username ?? "user"}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-sm font-semibold">
              {(other?.username?.[0] ?? "?").toUpperCase()}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium truncate">
              {other?.fullName || other?.username || "Unknown"}
            </p>
            <p className="text-xs text-gray-500">
              {(conversation as any).lastMessageAt
                ? new Date(
                    (conversation as any).lastMessageAt,
                  ).toLocaleDateString()
                : ""}
            </p>
          </div>

          <p className="text-sm text-gray-500 truncate">
            {preview || "No messages yet"}
          </p>
        </div>
      </div>
    </button>
  );
}
