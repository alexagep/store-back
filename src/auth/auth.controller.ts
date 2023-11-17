import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, VerifyValidationCodeDto } from './DTO/auth.dto';
import { AccessTokenDto, VerifyValidationCodeResponse } from './auth.interface';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { Users } from 'src/users/users.entity';
import { GetUser } from 'src/helper/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<AccessTokenDto> {
    return this.authService.login(loginDto);
  }

  @Post('verify-email')
  @UseGuards(JwtAuthGuard)
  async verify(
    @Body() verifyValidationCodeRequest: VerifyValidationCodeDto,
    @GetUser() user: Users
  ): Promise<VerifyValidationCodeResponse> {
    return this.authService.validateEmail(verifyValidationCodeRequest, user);
  }
}
