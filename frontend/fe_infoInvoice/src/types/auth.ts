export interface AuthRequest {
  providerId: number;
  url: string;
  maDvcs: string;
  username: string;
  password: string;
  tenantId: string;
}

export interface AuthResponse {
  message: string;
  code: number;
  accessToken: string;
  timestamp: string;
}

export interface AuthError {
  status: number;
  message: string;
}
