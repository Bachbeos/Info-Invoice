import { createBrowserRouter, Navigate } from "react-router-dom";
import type { ReactElement } from "react";
import Login from "../pages/auth/login/login";
import PublicInvoice from "../pages/public-invoice/publicInvoice";
import { getToken } from "../utils/token";

function AuthRedirect() {
  return <Navigate to={getToken() ? "/public-invoice" : "/login"} replace />;
}

function GuestOnlyRoute({ children }: { children: ReactElement }) {
  if (getToken()) {
    return <Navigate to="/public-invoice" replace />;
  }

  return children;
}

function ProtectedRoute({ children }: { children: ReactElement }) {
  if (!getToken()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthRedirect />,
  },
  {
    path: "/login",
    element: (
      <GuestOnlyRoute>
        <Login />
      </GuestOnlyRoute>
    ),
  },
  {
    path: "/public-invoice",
    element: (
      <ProtectedRoute>
        <PublicInvoice />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <AuthRedirect />,
  },
]);

export default router;
