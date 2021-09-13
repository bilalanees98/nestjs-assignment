import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from 'src/common/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const emailExists = await this.userModel.countDocuments({
        email: createUserDto.email,
      });
      if (emailExists) {
        return { error: 'user already exists' };
      }
      createUserDto.password = await this.authService.hashPassword(
        createUserDto.password,
      );
      // req.body.password = db.Users.getHashedPassword(req.body.password); //--add password hasing here

      return await this.userModel.create(createUserDto);
    } catch (error) {
      return { error: error.toString() };
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
      return { error: error.toString() };
    }
  }

  async findOne(id: string): Promise<User | undefined> {
    try {
      const user = await this.userModel.findOne({ _id: id });

      return user;
    } catch (error) {
      //raise an error over here
      //return { error: error.toString() };
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      return await this.userModel.findByIdAndUpdate(id, updateUserDto, {
        new: true,
      });
    } catch (error) {
      return { error: error.toString() };
    }
  }

  async remove(id: string) {
    try {
      return await this.userModel.findByIdAndDelete(id);
    } catch (error) {
      return { error: error.toString() };
    }
  }

  async getUser(email: string): Promise<UserDocument> {
    try {
      const user = await this.userModel.findOne({ email: email });
      return user;
    } catch (error) {}
  }
  async login(loginUserDto: LoginUserDto) {
    const potentialUser = await this.getUser(loginUserDto.email);
    if (
      potentialUser &&
      (await this.authService.comparePasswords(
        loginUserDto.password,
        potentialUser.password,
      ))
    ) {
      return await this.authService.generateJwt(potentialUser);
    } else {
      console.log('throwing an error');
      //throw some sort of error
    }
  }
}
