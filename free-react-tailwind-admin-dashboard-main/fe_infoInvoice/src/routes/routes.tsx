import { createBrowserRouter, Navigate } from "react-router-dom";
import SignIn from "../features/auth/SignIn";
import SignUp from "../features/auth/SignUp";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/" replace />,
    },
    {
        path: "sign-in",
        element: <SignIn />
    },
    {
        path: "sign-up",
        element: <SignUp />
    }
])

export default router