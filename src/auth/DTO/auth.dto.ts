import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  ValidateIf,
  Validate,
  IsJWT,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsMobile, IsPassword, UserExistsRule } from '../custom.validator';

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
  strategy: string;

  @IsNotEmpty()
  @IsString()
  verifier: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}

export class UserProfileDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  defaultAiModel: string;
}

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  strategy: string;

  @Validate(UserExistsRule)
  @IsNotEmpty()
  @IsEmail()
  @ValidateIf((o) => o.strategy === 'email')
  email: string;

  @Validate(UserExistsRule)
  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => o.strategy === 'mobile')
  @IsMobile()
  mobile: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @IsPassword()
  password: string;

  @IsNotEmpty()
  @IsString()
  referralCode: string;

  @Type(() => UserProfileDto)
  profile: UserProfileDto;

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

export class RefreshTokenDto {
  @IsJWT()
  @IsNotEmpty()
  token: string;
}

export class LogoutDto {
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
  @IsString()
  strategy: string;

  @IsNotEmpty()
  @IsEmail()
  @ValidateIf((o) => o.strategy === 'email')
  email: string;

  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => o.strategy === 'mobile')
  @IsMobile()
  mobile: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @IsPassword()
  password: string;
}
