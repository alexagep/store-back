import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, VerifyValidationCodeDto } from './DTO/auth.dto';
import { AccessTokenDto, VerifyValidationCodeResponse } from './auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<AccessTokenDto> {
    return this.authService.login(loginDto);
  }

  @Post('verify-email')
  async verify(
    @Body() verifyValidationCodeRequest: VerifyValidationCodeDto,
  ): Promise<VerifyValidationCodeResponse> {
    return this.authService.validateEmail(verifyValidationCodeRequest);
  }
}
