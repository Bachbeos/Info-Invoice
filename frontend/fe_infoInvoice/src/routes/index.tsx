import { createBrowserRouter } from "react-router-dom";
import Login from "../features/auth/login";
import { AuthRedirect, GuestOnlyRoute, ProtectedRoute } from "../components/auth-guard/auth-guard";
import MainLayout from "../components/layout/main-layout";
import InvoiceList from "../features/invoice/invoice";

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
    path: "/invoice",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <InvoiceList />,
      },
    ],
  },
  {
    path: "*",
    element: <AuthRedirect />,
  },
]);

export default router;
