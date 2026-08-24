import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../auth.store";

export default function PublicRoute() {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  console.log("PublicRoute auth:", isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}