import { useState } from "react";
import { CreatePostDialog } from "./CreatePostDialog";

export function CreatePostBox() {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded-xl bg-white p-3">
      <div className="text-sm font-medium mb-2">Create a post</div>
      <button
        onClick={() => setOpen(true)}
        className="w-full text-left border rounded px-3 py-2 text-sm opacity-80 hover:bg-black/5"
      >
        What&apos;s on your mind?
      </button>

      <CreatePostDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
