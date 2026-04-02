import { apiClient } from "../lib/apiClient";
import endpoint from "../configs/urls";
import type { AuthRequest, AuthResponse } from "../types/auth";

const authService = {
  login: (body: AuthRequest) =>
    apiClient.post<AuthResponse>(endpoint.auth.login, body),
};

export default authService;
