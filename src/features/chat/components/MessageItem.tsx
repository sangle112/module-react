import type { Message } from "@/shared/types/chat";

type Props = {
  message: Message;
  isMine: boolean;
};
// const timeText = message.createdAt;

export function MessageItem({ message, isMine }: Props) {
  return (
    <div
      className={["flex", isMine ? "justify-end" : "justify-start"].join(" ")}
    >
      <div
        className={[
          "max-w-[75%] rounded-2xl px-3 py-2 text-sm",
          isMine ? "bg-black text-white" : "bg-gray-100 text-gray-900",
        ].join(" ")}
      >
        {message.messageType === "image" ? (
          <div className="space-y-2">
            {message.imageUrl ? (
              <img
                src={message.imageUrl}
                alt="message"
                className="rounded-xl max-h-72 object-cover"
              />
            ) : (
              <p className="opacity-80">Image</p>
            )}
            {message.content ? <p>{message.content}</p> : null}
          </div>
        ) : (
          <p className="whitespace-pre-wrap break-words">
            {message.content ?? ""}
          </p>
        )}

        <div className="mt-1 text-[11px] opacity-70">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          {/* {timeText} */}
          {isMine ? (message.isRead ? " · Seen" : " · Sent") : null}
        </div>
      </div>
    </div>
  );
}
