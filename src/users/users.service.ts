import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './DTO/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
  ) {}

  async create(userInfo: CreateUserDto): Promise<Users> {
    const createdUser = await this.userRepository.create(userInfo);
    return this.userRepository.save(createdUser);
  }

  async findUserByEmail(email: string): Promise<Users | null> {
    // use the repository method to find a user by email and hashed password
    const user = await this.userRepository.findOne({
      where: { email },
    });
    // return the user or null if not found
    return user || null;
  }

  async updateVerifiedEmail(email: string): Promise<void> {
    await this.userRepository.update({ email }, { emailVerified: true });
  }
}
