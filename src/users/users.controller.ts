import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './DTO/user.dto';
import { Users } from './users.entity';
import { HashPasswordPipe } from 'src/auth/mapper/auth.transform.pipe';
import { GetUser } from 'src/helper/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { VerifyValidationCodeResponse } from 'src/auth/auth.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async create(@Body(HashPasswordPipe) userInfo: CreateUserDto): Promise<Users> {
    const result = await this.usersService.create(userInfo);
    return result;
  }

  @Post('re-send')
  @UseGuards(JwtAuthGuard)
  async resend(@GetUser() user: Users): Promise<VerifyValidationCodeResponse> {
    const result = await this.usersService.resendCode(user);
    return result;
  }
}
