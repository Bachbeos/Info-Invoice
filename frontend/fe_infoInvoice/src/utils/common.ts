import { toast } from "react-toastify";

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