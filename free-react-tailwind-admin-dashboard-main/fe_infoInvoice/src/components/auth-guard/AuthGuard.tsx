import { Navigate, useLocation } from "react-router-dom";
import type { ReactElement } from "react";
import { getToken } from "../../utils/common";

export function AuthRedirect() {
  return <Navigate to={getToken() ? "/invoice" : "/signin"} replace />;
}

export function GuestOnlyRoute({ children }: { children: ReactElement }) {
  if (getToken()) {
    return <Navigate to="/invoice" replace />;
  }
  return children;
}

export function ProtectedRoute({ children }: { children: ReactElement }) {
  const location = useLocation();

  if (!getToken()) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  return children;
}
