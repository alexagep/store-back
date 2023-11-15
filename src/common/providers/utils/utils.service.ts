import * as bcrypt from 'bcrypt';

export class UtilsService {
  static async hashPassword(textPassword: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(textPassword, salt);
  }
  static async comparePass(textPassword: string, hash: string) {
    return await bcrypt.compare(textPassword, hash);
  }
}
