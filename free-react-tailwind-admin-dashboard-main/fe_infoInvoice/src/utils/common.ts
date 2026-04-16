import { toast } from "react-toastify";
import { Cookies } from "react-cookie";

/**
 * Hiển thị thông báo toast
 * @param {string} msg - Nội dung thông báo
 * @param {'error' | 'success' | 'warning' | 'info'} type - Loại thông báo
 */
export const showToast = (msg: string, type: "error" | "success" | "warning" | "info" = "info") => {
    toast[type](msg, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
};

const ACCESS_TOKEN_KEY = "accessToken";
const cookies = new Cookies();

export function getToken(): string {
    try {
        return cookies.get(ACCESS_TOKEN_KEY) ?? "";
    } catch {
        return "";
    }
}

export function setToken(token: string): void {
    try {
        cookies.set(ACCESS_TOKEN_KEY, token, {
            path: "/",
            sameSite: "lax",
            secure: window.location.protocol === "https:",
        });
    } catch {
        // Ignore storage errors
    }
}

export function clearToken(): void {
    try {
        cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
    } catch {
        // Ignore storage errors
    }
}