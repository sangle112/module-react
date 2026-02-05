import { useState } from "react";
import { useCreateComment } from "../hooks/useCreateComment";

type Props = {
  postId: string;
  autoFocus?: boolean;
};

export function CommentComposer({ postId, autoFocus }: Props) {
  const [text, setText] = useState("");
  const create = useCreateComment(postId);

  const disabled = create.isPending || !text.trim();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const content = text.trim();
    if (!content) return;

    create.mutate(content, {
      onSuccess: () => setText(""),
    });
  };

  return (
    <form onSubmit={onSubmit} className="p-3 flex items-center gap-2 border-b">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoFocus={autoFocus}
        placeholder="Add a comment..."
        className="flex-1 border rounded-md px-3 py-2 text-sm"
      />

      <button
        type="submit"
        disabled={disabled}
        className="px-3 py-2 rounded-md bg-black text-white text-sm disabled:opacity-50"
      >
        {create.isPending ? "..." : "Post"}
      </button>
    </form>
  );
}
