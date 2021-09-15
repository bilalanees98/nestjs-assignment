import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from 'src/users/schemas/user.schema';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

<<<<<<< HEAD:src/common/auth/auth.service.ts
  async verifyToken(token: string) {
    return await this.jwtService.verifyAsync(token);
  }
  async hashPassword(password: string) {
=======
  async hashPassword(password: string): string {
>>>>>>> 712f6b5e3b7943caae210f61f528ecb35babb0e7:src/auth/auth.service.ts
    return await bcrypt.hash(password, 12);
  }
  async comparePasswords(
    pass: string,
    storedPassHash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(pass, storedPassHash);
  }
  async generateJwt(user: UserDocument) {
    const payload = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
