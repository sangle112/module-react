import { useRef, useState } from "react";

type Props = {
  disabled?: boolean;
  onSendText: (text: string) => Promise<unknown> | void;
  onSendImage?: (file: File) => Promise<unknown> | void;
};

export function ChatInput({ disabled, onSendText, onSendImage }: Props) {
  const [text, setText] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  const canSend = !disabled && text.trim().length > 0;

  const handleSend = async () => {
    if (!canSend) return;
    const value = text.trim();
    setText("");
    await onSendText(value);
  };

  const handlePickImage = () => {
    if (disabled || !onSendImage) return;
    fileRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !onSendImage) return;
    await onSendImage(file);
  };

  return (
    <div className="border-t p-3">
      <div className="flex items-center gap-2">
        {onSendImage ? (
          <>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={disabled}
            />
            <button
              type="button"
              onClick={handlePickImage}
              disabled={disabled}
              className="px-3 py-2 rounded-lg border hover:bg-gray-50 disabled:opacity-60"
              title="Send image"
            >
              📎
            </button>
          </>
        ) : null}

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message..."
          disabled={disabled}
          className="flex-1 px-3 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-black/10 disabled:bg-gray-50"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void handleSend();
            }
          }}
        />

        <button
          type="button"
          onClick={() => void handleSend()}
          disabled={!canSend}
          className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-60"
        >
          Send
        </button>
      </div>
    </div>
  );
}
