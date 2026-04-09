export interface AuthRequest {
  providerId: number;
  url: string;
  maDvcs: string;
  username: string;
  password: string;
  tenantId: string;
}

export interface AuthResponse {
  isSuccess: boolean;
  code: number;
  message: string;
  data: {
    accessToken: string;
  };
  timeStamp: string;
}

export interface AuthError {
  status: number;
  message: string;
}
