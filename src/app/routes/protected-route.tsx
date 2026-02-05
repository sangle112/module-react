import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";

export default function ProtectedRoute() {
  const { isHydrated, isAuthenticated } = useAuth();

  if (!isHydrated) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
}
