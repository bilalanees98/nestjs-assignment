import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from 'src/common/auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import * as Error from '../common/error.handler';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private authService: AuthService,
  ) {}

  async userExists(id: string) {
    const exists = await this.userModel.countDocuments({
      _id: id,
    });
    if (exists) {
      return true;
    } else {
      return false;
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const emailExists = await this.userModel.countDocuments({
        email: createUserDto.email,
      });
      if (emailExists) {
        Error.http400('user with this email already exists');
      }

      createUserDto.password = await this.authService.hashPassword(
        createUserDto.password,
      );
      const user = await this.userModel.create(createUserDto);
      return await this.userModel.findOne({ _id: user.id });
    } catch (error) {
      Error.http400(error.message);
    }
  }

  async findAll(offset: string, limit: string) {
    try {
      const users = await this.userModel
        .find()
        .sort({ _id: -1 })
        .skip(offset ? parseInt(offset) : 0)
        .limit(limit ? parseInt(limit) : 0);

      return users;
    } catch (error) {
      Error.http400(error.message);
    }
  }

  async findOne(id: string): Promise<User | undefined> {
    try {
      const user = await this.userModel.findOne({ _id: id });
      return user;
    } catch (error) {
      Error.http400(error.message);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      return await this.userModel.findByIdAndUpdate(id, updateUserDto, {
        new: true,
      });
    } catch (error) {
      Error.http400(error.message);
    }
  }

  async remove(id: string) {
    try {
      return await this.userModel.findByIdAndDelete(id);
    } catch (error) {
      Error.http400(error.message);
    }
  }

  async getUser(email: string): Promise<UserDocument> {
    try {
      const user = await this.userModel.findOne({ email: email });
      return user;
    } catch (error) {
      Error.http400(error.message);
    }
  }
  async login(loginUserDto: LoginUserDto) {
    const potentialUser = await await this.userModel
      .findOne({ email: loginUserDto.email })
      .select('+password');
    if (
      potentialUser &&
      (await this.authService.comparePasswords(
        loginUserDto.password,
        potentialUser.password,
      ))
    ) {
      return await this.authService.generateJwt(potentialUser);
    } else {
      Error.http401('incorrect credentials');
    }
  }
}
