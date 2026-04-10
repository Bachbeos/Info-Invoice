import { apiClient } from "../lib/apiClient";
import endpoint from "../configs/urls";
import type { AuthRequest, AuthResponse, ProviderConfig } from "../types/auth";

const authService = {
  login: (body: AuthRequest) =>
    apiClient.post<AuthResponse>(endpoint.auth.login, body),
  getProviderConfigs: (providerId: number) =>
    apiClient.get<ProviderConfig[]>(endpoint.auth.providerConfigs, { providerId }),
};

export default authService;
