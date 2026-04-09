import { apiClient } from "../lib/apiClient";
import endpoint from "../configs/urls";
import type { AuthRequest, AuthResponse } from "../types/auth";

const authService = {
  login: (body: AuthRequest) =>
    apiClient.post<AuthResponse>(endpoint.auth.login, body),
  getProviderConfigs: (username: string, providerId: number) =>
    apiClient.get<any[]>(endpoint.auth.providerConfigs, { username, providerId }),
};

export default authService;
