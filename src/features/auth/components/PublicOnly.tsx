import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function PublicOnly({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isHydrating } = useAuth();
  if (isHydrating) return null;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}
