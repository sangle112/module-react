import type { User } from "@/shared/types/user";
import { Link } from "react-router-dom";

export function ExploreUserItem({ user }: { user: User }) {
  const anyUser = user as any;

  const id = anyUser?._id || anyUser?.id;
  const username = anyUser?.username || anyUser?.name || "unknown";
  const avatar =
    anyUser?.avatar?.url || anyUser?.avatarUrl || anyUser?.avatar || "";

  return (
    <Link
      to={id ? `/users/${id}` : "#"}
      className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent transition"
    >
      <div className="h-9 w-9 rounded-full overflow-hidden bg-muted shrink-0">
        {avatar ? (
          <img
            src={avatar}
            alt={username}
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>

      <div className="min-w-0">
        <div className="text-sm font-medium truncate">{username}</div>
        {anyUser?.fullName ? (
          <div className="text-xs text-muted-foreground truncate">
            {anyUser.fullName}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
