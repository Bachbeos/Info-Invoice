import { useState } from "react";
import type { AuthRequest, AuthResponse } from "../types/auth";
import { apiClient } from "../lib/apiClient";
import { setToken } from "../utils/token";
import { showToast } from "../utils/common";
import { useNavigate } from "react-router-dom";

interface UseLoginResult {
  login: (body: AuthRequest) => Promise<void>;
  isLoading: boolean;
}

export function useLogin(): UseLoginResult {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (body: AuthRequest): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await apiClient.post<AuthResponse>("/auth/login", body);
      if (response.code === 200 && response.accessToken) {
        setToken(response.accessToken);
        navigate("/public-invoice");
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra, vui lòng thử lại!";
      showToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
}
