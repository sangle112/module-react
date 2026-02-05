import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";

export default function PublicRoute() {
  const { isHydrated, isAuthenticated } = useAuth();

  if (!isHydrated) return null;

  // đã login rồi thì không cho vào auth pages nữa
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
