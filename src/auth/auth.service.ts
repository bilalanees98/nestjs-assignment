import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from 'src/users/schemas/user.schema';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  hashPassword(password: string): string {
    return bcrypt.hash(password, 12);
  }
  async comparePasswords(
    pass: string,
    storedPassHash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(pass, storedPassHash);
  }
  async generateJwt(user: UserDocument) {
    const payload = { id: user._id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
