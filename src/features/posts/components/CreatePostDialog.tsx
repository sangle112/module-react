import { useMemo, useState } from "react";
import { useCreatePost } from "../hooks/useCreatePost";
import { useAuth } from "@/app/providers/AuthProvider";

export function CreatePostDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const create = useCreatePost();
  const [caption, setCaption] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const { isHydrated, isAuthenticated } = useAuth();
  const disabled = !isHydrated || !isAuthenticated;
  const previews = useMemo(
    () => files.map((f) => ({ file: f, url: URL.createObjectURL(f) })),
    [files],
  );

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files.length) return;

    create.mutate(
      { caption: caption.trim() || undefined, files },
      { onSuccess: () => onClose() },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-[min(720px,92vw)] rounded-xl bg-white shadow">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="font-semibold">Create new post</div>
          <button
            className="px-2 py-1 rounded hover:bg-black/5"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form onSubmit={submit} className="p-3 grid gap-3">
          <input
            type="file"
            accept="image/jpeg,image/png,video/mp4"
            multiple
            onChange={(e) => {
              const next = Array.from(e.target.files ?? []);

              const bad = next.find(
                (f) => f.type === "image/webp" || f.name.endsWith(".webp"),
              );
              if (bad) {
                alert(
                  "File .webp hiện đang gây lỗi upload. Vui lòng dùng .jpg/.png",
                );
                return;
              }
              setFiles(next);
            }}
            className="border rounded px-3 py-2"
          />

          {previews.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {previews.map((p) => (
                <div
                  key={p.url}
                  className="aspect-square bg-black/5 overflow-hidden rounded"
                >
                  {/* chỉ preview ảnh cho đơn giản */}
                  <img
                    src={p.url}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>
              ))}
            </div>
          )}

          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            className="border rounded px-3 py-2 min-h-[90px]"
          />

          {create.isError && (
            <div className="text-sm text-red-600">
              Create failed:{" "}
              {String((create.error as any)?.message ?? create.error)}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-3 py-2 rounded border"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              disabled={disabled || create.isPending || !files.length}
              className="px-3 py-2 rounded bg-black text-white disabled:opacity-60"
            >
              {create.isPending ? "Posting..." : "Share"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
