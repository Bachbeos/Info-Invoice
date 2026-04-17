import { createBrowserRouter, Outlet } from "react-router-dom";
import {
  AuthRedirect,
  GuestOnlyRoute,
  ProtectedRoute,
} from "../components/auth-guard/AuthGuard";
import NotFound from "../features/others/NotFound";
import SignIn from "../features/auth/SignIn";
import SignUp from "../features/auth/SignUp";
import InvoiceList from "../features/invoice/Invoice";
import AppLayout from "../layout/AppLayout";
import { ScrollToTop } from "../components/common/ScrollToTop";

const router = createBrowserRouter([
  {
    element: (
      <>
        <ScrollToTop />
        <Outlet />
      </>
    ),
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <AuthRedirect />,
      },
      {
        path: "invoice",
        element: (
          <ProtectedRoute>
            <AppLayout />
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
        path: "signin",
        element: (
          <GuestOnlyRoute>
            <SignIn />
          </GuestOnlyRoute>
        ),
      },
      {
        path: "signup",
        element: (
          <GuestOnlyRoute>
            <SignUp />
          </GuestOnlyRoute>
        ),
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
