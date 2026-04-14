import endpoint from "../../../configs/urls";
import { apiClient } from "../../../lib/apiClient";
import type { AuthRequest, AuthResponse, ProviderConfig, ProviderResponse } from "../types/auth";


const AuthService = {

    login: (body: AuthRequest): Promise<AuthResponse> =>
        apiClient.post<AuthResponse>(endpoint.auth.login, body),

    getProviders: () => apiClient.get<ProviderResponse[]>(endpoint.auth.providers),

    getProviderConfigs: (providerId: number): Promise<ProviderConfig[]> =>
        apiClient.get<ProviderConfig[]>(endpoint.auth.providerConfigs, {
            providerId,
        }),
}

export default AuthService;

