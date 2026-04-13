import { createBrowserRouter } from "react-router-dom";
import Login from "../features/auth/login";
import PublicInvoice from "../pages/public-invoice/publicInvoice";
import { AuthRedirect, GuestOnlyRoute, ProtectedRoute } from "../components/auth-guard/auth-guard";

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
