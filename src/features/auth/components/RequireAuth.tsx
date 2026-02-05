import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isHydrating } = useAuth();
  const location = useLocation();

  if (isHydrating) return null; // hoặc spinner
  if (!isAuthenticated)
    return <Navigate to="/login" replace state={{ from: location }} />;

  return children;
}
