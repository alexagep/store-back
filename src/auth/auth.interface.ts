export class AccessTokenDto {
  token: string;
}

export interface TokenClaim {
  id: string;
  name: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
}

export interface VerifyValidationCodeResponse {
  message: string;
  token?: string;
}
