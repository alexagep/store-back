import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  ValidateIf,
  Validate,
  IsJWT,
} from 'class-validator';
import { IsPassword } from '../custom.validator';

export class SendVerificationDto {
  @IsNotEmpty()
  @IsString()
  strategy: string;

  @IsNotEmpty()
  @IsString()
  verifier: string;
}

export class VerifyValidationCodeDto {
  @IsNotEmpty()
  @IsString()
  code: string;
}

export class SignupDto {
  @Validate(UserExistsRule)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @IsPassword()
  password: string;

  @IsNotEmpty()
  @IsString()
  token: string;
}

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @IsPassword()
  password: string;
}

export class VerifyTokenDto {
  @IsJWT()
  @IsNotEmpty()
  token: string;
}

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @IsPassword()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @IsPassword()
  newPassword: string;

  @IsJWT()
  @IsNotEmpty()
  @IsString()
  token: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @IsPassword()
  password: string;
}
