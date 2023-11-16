export class AccessTokenDto {
  token: string;
}

export interface TokenClaim {
  id: string;
  name: string;
  lastName: string;
  email: string;
}

export interface VerifyValidationCodeResponse {
  message: string;
}
