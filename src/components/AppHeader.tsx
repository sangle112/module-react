import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import { Compass, Home, LogOut, Search, MessageCircle } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchUsers } from "@/features/explore/hooks/useSearchUsers";
import { useUnreadCount } from "@/features/chat/hooks/useUnreadCount";

function getUserId(u: any) {
  return u?._id || u?.id;
}
function getUsername(u: any) {
  return u?.username || u?.name || "unknown";
}
function getAvatar(u: any) {
  return u?.avatar || u?.avatarUrl || u?.profilePicture || u?.photo || "";
}

export function AppHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const onLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const avatarUrl = user?.avatar ?? user?.profilePicture ?? "";

  // ✅ unread badge for chat
  const { data: unreadData } = useUnreadCount(Boolean(user));
  const unreadCount = (unreadData as any)?.count ?? 0;

  // sync q from URL (nếu user vào /explore?q=abc)
  const initialQ = (searchParams.get("q") ?? "").trim();
  const [q, setQ] = useState(initialQ);

  useEffect(() => {
    setQ(initialQ);
  }, [initialQ]);

  // dropdown state
  const [open, setOpen] = useState(false);

  // tách ref desktop/mobile để click-outside không bị lỗi
  const desktopRef = useRef<HTMLDivElement | null>(null);
  const mobileRef = useRef<HTMLDivElement | null>(null);

  const query = q.trim();
  const usersQuery = useSearchUsers(query);

  const topUsers = useMemo(() => {
    const arr = (usersQuery.data ?? []) as any[];
    return arr.slice(0, 6);
  }, [usersQuery.data]);

  // click outside -> close
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;

      const inDesktop = desktopRef.current?.contains(t);
      const inMobile = mobileRef.current?.contains(t);

      if (!inDesktop && !inMobile) setOpen(false);
    };

    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const qq = q.trim();
    setOpen(false);
    navigate(qq ? `/explore?q=${encodeURIComponent(qq)}` : "/explore");
  };

  const goUser = (u: any) => {
    const id = getUserId(u);
    if (!id) return;
    setOpen(false);
    setQ(""); // optional: clear input sau khi chọn
    navigate(`/users/${id}`);
  };

  const ResultsDropdown = (
    <div className="absolute left-0 right-0 mt-2 rounded-xl border bg-white shadow-sm overflow-hidden">
      <div className="px-3 py-2 text-xs text-gray-500 border-b">
        Users {usersQuery.isFetching ? "• Searching..." : ""}
      </div>

      <div className="max-h-72 overflow-auto">
        {usersQuery.isLoading ? (
          <div className="px-3 py-3 text-sm text-gray-500">Loading...</div>
        ) : topUsers.length ? (
          topUsers.map((u) => {
            const id = getUserId(u);
            const name = getUsername(u);
            const ava = getAvatar(u);

            return (
              <button
                key={id ?? name}
                type="button"
                onClick={() => goUser(u)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 text-left"
              >
                <div className="h-9 w-9 rounded-full overflow-hidden border bg-gray-100 shrink-0">
                  {ava ? (
                    <img
                      src={ava}
                      alt={name}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{name}</div>
                  {u?.fullName ? (
                    <div className="text-xs text-gray-500 truncate">
                      {u.fullName}
                    </div>
                  ) : null}
                </div>
              </button>
            );
          })
        ) : (
          <div className="px-3 py-3 text-sm text-gray-500">No users found</div>
        )}
      </div>

      <div className="px-3 py-2 border-t">
        <button
          type="submit"
          onClick={submitSearch}
          className="text-sm hover:underline"
        >
          See all results in Explore
        </button>
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between gap-3">
        {/* Left */}
        <Link to="/" className="font-semibold text-lg shrink-0">
          Instagram Clone
        </Link>

        {/* Middle: Search (Desktop) */}
        <div className="hidden md:block w-full max-w-md" ref={desktopRef}>
          <form onSubmit={submitSearch} className="relative" autoComplete="off">
            <div className="flex items-center gap-2 h-9 px-3 rounded-xl bg-gray-100 border">
              <Search size={18} className="text-gray-500" />
              <input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                placeholder="Search users…"
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>

            {open && query.length > 0 ? ResultsDropdown : null}
          </form>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 shrink-0">
          <NavLink
            to="/"
            aria-label="Home"
            className={({ isActive }) =>
              `h-9 w-9 rounded-full flex items-center justify-center transition ${
                isActive ? "bg-accent" : "hover:bg-accent"
              }`
            }
          >
            <Home size={20} />
          </NavLink>

          <NavLink
            to="/explore"
            aria-label="Explore"
            className={({ isActive }) =>
              `h-9 w-9 rounded-full flex items-center justify-center transition ${
                isActive ? "bg-accent" : "hover:bg-accent"
              }`
            }
          >
            <Compass size={20} />
          </NavLink>

          {/* ✅ Chat icon + badge */}
          <NavLink
            to="/chats"
            aria-label="Chats"
            className={({ isActive }) =>
              `relative h-9 w-9 rounded-full flex items-center justify-center transition ${
                isActive ? "bg-accent" : "hover:bg-accent"
              }`
            }
          >
            <MessageCircle size={20} />
            {unreadCount > 0 ? (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[11px] flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            ) : null}
          </NavLink>

          <Link
            to="/profile"
            className="hidden sm:block text-sm hover:underline ml-1"
          >
            {user?.username ?? "User"}
          </Link>

          <Link
            to="/profile"
            className="h-9 w-9 rounded-full overflow-hidden border flex items-center justify-center bg-gray-100"
            aria-label="My profile"
            title="Profile"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xs text-gray-500">IG</span>
            )}
          </Link>

          <button
            onClick={onLogout}
            className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-accent transition"
            type="button"
            aria-label="Logout"
            title="Đăng xuất"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Mobile search + dropdown */}
      <div className="md:hidden border-t bg-white">
        <div className="mx-auto max-w-5xl px-4 py-2" ref={mobileRef}>
          <form onSubmit={submitSearch} className="relative" autoComplete="off">
            <div className="flex items-center gap-2 h-9 px-3 rounded-xl bg-gray-100 border">
              <Search size={18} className="text-gray-500" />
              <input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                placeholder="Search users…"
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>

            {open && query.length > 0 ? ResultsDropdown : null}
          </form>
        </div>
      </div>
    </header>
  );
}
