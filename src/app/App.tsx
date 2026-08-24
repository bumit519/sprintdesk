import { useEffect } from "react";

import { Outlet } from "react-router-dom";

import { useAuthStore } from "../features/auth/auth.store";

import { refreshAccessToken } from "../features/auth/services/auth.api";

import { tokenStorage } from "../features/auth/services/tokenStorage";

import Toast from "../components/feedback/Toast";

import { useToast } from "../components/feedback/useToast";

export default function App() {
  const setAuth = useAuthStore(
    (state) => state.setAuth,
  );

  const clearAuth = useAuthStore(
    (state) => state.clearAuth,
  );

  const setInitializing = useAuthStore(
    (state) => state.setInitializing,
  );

  const isInitializing = useAuthStore(
    (state) => state.isInitializing,
  );

  const type = useToast(
    (state) => state.type,
  );

  const message = useToast(
    (state) => state.message,
  );

  const isVisible = useToast(
    (state) => state.isVisible,
  );

  const hideToast = useToast(
    (state) => state.hideToast,
  );

  useEffect(() => {
    const initializeSession = async () => {
      const refreshToken =
        tokenStorage.getRefreshToken();

      if (!refreshToken) {
        setInitializing(false);
        return;
      }

      try {
        const data =
          await refreshAccessToken(refreshToken);

        const savedUser =
          tokenStorage.getUser();

        if (!savedUser) {
          tokenStorage.clearAll();
          clearAuth();
          return;
        }

        if (data.refreshToken) {
          tokenStorage.setRefreshToken(
            data.refreshToken,
          );
        }

        setAuth(
          savedUser,
          data.accessToken,
        );
      } catch (error) {
        console.error(
          "Session restore failed:",
          error,
        );

        tokenStorage.clearAll();
        clearAuth();
      } finally {
        setInitializing(false);
      }
    };

    initializeSession();
  }, [
    setAuth,
    clearAuth,
    setInitializing,
  ]);

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-sm font-medium text-slate-600">
          Checking session...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Outlet />

      {isVisible && (
        <Toast
          type={type}
          message={message}
          onClose={hideToast}
        />
      )}
    </div>
  );
}