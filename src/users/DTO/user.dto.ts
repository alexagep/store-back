import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { IsPassword } from 'src/auth/custom.validator';
// import { PartialType, PickType } from '@nestjs/mapped-types';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @IsPassword()
  password: string;
}

export class UpdateUserDto {
  @IsString()
  name: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;
}
