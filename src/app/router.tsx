import {
  createBrowserRouter,
  Navigate,
} from "react-router-dom";

import PublicRoute from "../features/auth/components/PublicRoute";
import LoginPage from "../features/auth/pages/LoginPage";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";

import DashboardPage from "../features/dashboard/pages/DashboardPage";
import App from "./App";

import { lazy, Suspense } from "react";

const Board = lazy(
  () => import("../features/board/components/Board"),
);

const Analytics = lazy(
  () => import("../features/analytics/components/Analytics"),
);

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="text-sm font-medium text-slate-400">
        Loading...
      </div>
    </div>
  );
}




function LazyPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<PageLoader />}>
      {children}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,

    children: [
      {
        index: true,
        element: (
          <Navigate
            to="/dashboard"
            replace
          />
        ),
      },

      // Public routes
      {
        element: <PublicRoute />,
        children: [
          {
            path: "login",
            element: <LoginPage />,
          },
        ],
      },

      // Protected routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "dashboard",
            element: <DashboardPage />,
          },

          {
            path: "board",
            element: (
              <LazyPage>
                <Board />
              </LazyPage>
            ),
          },

          {
            path: "analytics",
            element: (
              <LazyPage>
                <Analytics />
              </LazyPage>
            ),
          },
        ],
      },
    ],
  },
]);