export interface AuthRequest {
    providerId: number;
    url: string;
    maDvcs: string;
    tenantId: string;
    username: string;
    password: string;
}

export interface AuthResponseData {
    accessToken: string;
}

export interface AuthResponse {
    isSuccess: boolean;
    code: number;
    message: string;
    data: AuthResponseData;
    timeStamp: string;
}

export interface ProviderResponse {
    id: number;
    name: string;
}

export interface ProviderConfig {
    url?: string;
}

// Dùng cho React Hook Form
export type LoginFormValues = Omit<AuthRequest, "url"> & {
    url?: string;
};
