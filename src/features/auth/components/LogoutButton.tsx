import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../auth.store";
import { tokenStorage } from "../services/tokenStorage";

export default function LogoutButton() {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear Zustand auth state
    clearAuth();

    // Clear stored user + refresh token
    tokenStorage.clearAll();

    // Redirect to login
    navigate("/login", { replace: true });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
    >
      Logout
    </button>
  );
}