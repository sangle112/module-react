import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useUserPosts, type ProfilePostsFilter } from "../hooks/useUserPosts";

type Props = {
  userId?: string;
  defaultFilter?: ProfilePostsFilter;
};

export function ProfilePostsSection({ userId, defaultFilter = "all" }: Props) {
  const [filter, setFilter] = useState<ProfilePostsFilter>(defaultFilter);

  const q = useUserPosts(userId, filter, 12);

  const posts = useMemo(() => {
    const pages = q.data?.pages ?? [];
    return pages.flatMap((p) => p.posts ?? []);
  }, [q.data]);

  const isEmpty = !q.isLoading && posts.length === 0;

  return (
    <div className="border-t">
      {/* Tabs */}
      <div className="flex gap-2 p-2">
        <Tab active={filter === "all"} onClick={() => setFilter("all")}>
          All
        </Tab>
        <Tab active={filter === "video"} onClick={() => setFilter("video")}>
          Video
        </Tab>
        <Tab active={filter === "saved"} onClick={() => setFilter("saved")}>
          Saved
        </Tab>
      </div>

      {/* Body */}
      {q.isLoading ? (
        <div className="p-4 text-sm opacity-70">Loading posts...</div>
      ) : q.isError ? (
        <div className="p-4">
          <div className="text-sm mb-2">Load posts failed.</div>
          <button
            className="px-3 py-2 rounded border"
            onClick={() => q.refetch()}
          >
            Retry
          </button>
        </div>
      ) : isEmpty ? (
        <div className="p-6 text-sm opacity-70">No posts yet.</div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-1 p-2">
            {posts.map((p: any) => {
              const postId = p._id ?? p.id ?? p.postId;

              const firstMedia =
                p.media?.[0] ?? p.images?.[0] ?? p.thumbnail ?? p.image;
              const thumb =
                typeof firstMedia === "string"
                  ? firstMedia
                  : (firstMedia?.url ??
                    firstMedia?.thumbnailUrl ??
                    firstMedia?.secure_url);

              const mediaType = firstMedia?.type ?? p.type ?? "";
              const isVideo =
                String(mediaType).includes("video") || Boolean(p.videoUrl);

              return (
                <Link
                  key={postId}
                  to={`/p/${postId}`}
                  className="relative block aspect-square bg-black/5 overflow-hidden"
                >
                  {thumb ? (
                    <img
                      src={thumb}
                      alt="post"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs opacity-60">
                      No media
                    </div>
                  )}

                  {isVideo && (
                    <div className="absolute top-1 right-1 rounded bg-black/60 text-white text-[10px] px-1.5 py-0.5">
                      VIDEO
                    </div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Load more */}
          <div className="p-3 flex justify-center">
            {q.hasNextPage ? (
              <button
                onClick={() => q.fetchNextPage()}
                disabled={q.isFetchingNextPage}
                className="px-3 py-2 rounded border disabled:opacity-60"
              >
                {q.isFetchingNextPage ? "Loading..." : "Load more"}
              </button>
            ) : (
              <div className="text-xs opacity-60">End</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Tab({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "px-3 py-1 rounded text-sm border",
        active ? "bg-black text-white border-black" : "hover:bg-black/5",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
