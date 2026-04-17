import endpoint from "../../../configs/endpoint";
import { apiClient } from "../../../libs/apiClients";
import type {
  AuthRequest,
  AuthResponse,
  ProviderConfig,
  ProviderResponse,
} from "../types/auth.type";

const AuthService = {
  login: (body: AuthRequest): Promise<AuthResponse> =>
    apiClient.post<AuthResponse>(endpoint.auth.login, body),

  getProviders: () =>
    apiClient.get<ProviderResponse[]>(endpoint.auth.providers),

  getProviderConfigs: (
    providerId: number,
    signal?: AbortSignal,
  ): Promise<ProviderConfig[]> =>
    apiClient.get<ProviderConfig[]>(
      endpoint.auth.providerConfigs,
      {
        providerId,
      },
      signal,
    ),
};

export default AuthService;
