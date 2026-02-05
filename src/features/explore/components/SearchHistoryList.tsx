export function SearchHistoryList({
  items,
  onDelete,
  onClearAll,
  onPick,
  isDeleting,
  isClearing,
}: {
  items: any[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onPick: (q: string) => void;
  isDeleting?: boolean;
  isClearing?: boolean;
}) {
  if (!items?.length) return null;

  return (
    <div className="rounded-xl border bg-background overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <div className="text-sm font-medium">Recent searches</div>
        <button
          onClick={onClearAll}
          disabled={!!isClearing}
          className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          Clear all
        </button>
      </div>

      <div className="divide-y">
        {items.map((it) => {
          const id = it?._id || it?.id;
          const q = it?.q || it?.query || it?.text || "";

          return (
            <div
              key={id ?? q}
              className="flex items-center justify-between px-3 py-2"
            >
              <button
                onClick={() => onPick(String(q))}
                className="text-sm hover:underline truncate text-left flex-1"
              >
                {String(q)}
              </button>

              {id ? (
                <button
                  onClick={() => onDelete(String(id))}
                  disabled={!!isDeleting}
                  className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-50 ml-3"
                >
                  Delete
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
