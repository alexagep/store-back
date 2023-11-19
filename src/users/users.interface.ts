import { Users } from './users.entity';

export interface CreateUserResponse {
  message: string;
  userInfo: Users;
}
