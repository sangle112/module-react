import { NavLink, Outlet } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Compass, Home } from "lucide-react";

export function MainLayout() {
  return (
    <div className="min-h-screen bg-white">
      <AppHeader />

      {/* IG-style quick nav */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-2">
          <nav className="flex items-center gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-accent transition ${
                  isActive ? "bg-accent font-semibold" : ""
                }`
              }
            >
              <Home size={18} />
              <span>Home</span>
            </NavLink>

            <NavLink
              to="/explore"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-accent transition ${
                  isActive ? "bg-accent font-semibold" : ""
                }`
              }
            >
              <Compass size={18} />
              <span>Explore</span>
            </NavLink>
          </nav>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
