import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './DTO/user.dto';
import { Users } from './users.entity';
import { HashPasswordPipe } from 'src/auth/mapper/auth.transform.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async create(@Body(HashPasswordPipe) userInfo: CreateUserDto): Promise<Users> {
    const result = await this.usersService.create(userInfo);
    return result;
  }
}
