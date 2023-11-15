import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './DTO/user.dto';
import { Users } from './users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async create(@Body() userInfo: CreateUserDto): Promise<Users> {
    const result = await this.usersService.create(userInfo);
    return result;
  }
}
