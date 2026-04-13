import { Navigate, useLocation } from "react-router-dom";
import { getToken } from "../../utils/token";
import type { ReactElement } from "react";


export function AuthRedirect() {
    return <Navigate to={getToken() ? "/public-invoice" : "/login"} replace />;
}

export function GuestOnlyRoute({ children }: { children: ReactElement }) {
    if (getToken()) {
        return <Navigate to="/public-invoice" replace />;
    }
    return children;
}

export function ProtectedRoute({ children }: { children: ReactElement }) {
    const location = useLocation();

    if (!getToken()) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
}