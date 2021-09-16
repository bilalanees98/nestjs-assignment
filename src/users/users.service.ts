import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostsService } from 'src/posts/posts.service';
import { AuthService } from 'src/common/auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import * as Error from '../common/error.handler';
import { Request, response } from 'express';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly postsService: PostsService,
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

  async getUserPosts(userId: string) {
    try {
      const user = await this.userModel.findOne({ _id: userId });
      const posts = await this.postsService.getUserPosts(user);
      return { data: posts };
    } catch (error) {
      return { error: error.toString() };
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
    try {
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
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
          status: error.status,
        },
        error.status,
      );
    }
  }

  async follow(userToFollowId: string, currentUserId: string) {
    try {
      await this.userModel.updateOne(
        { _id: currentUserId },
        { $addToSet: { following: userToFollowId } },
      );
    } catch (error) {
      Error.http400(error.message);
    }
  }
  async unfollow(userToFollowId: string, currentUserId: string) {
    try {
      await this.userModel.updateOne(
        { _id: currentUserId },
        { $pull: { following: userToFollowId } },
      );
    } catch (error) {
      Error.http400(error.message);
    }
  }

  async getFeed(req: Request) {
    try {
      const offset = req.query.offset
        ? parseInt(req.query.offset as string)
        : 0;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 0;
      const keyword = req.query.keyword ? (req.query.keyword as string) : null;
      const sort = req.query.sort ? (req.query.sort as string) : 'desc';

      const following = (await this.userModel.findOne({ _id: req.user['id'] }))
        .following;
      return await this.postsService.feed(
        following,
        offset,
        limit,
        keyword,
        sort,
      );
    } catch (error) {
      Error.http400(error.message);
    }
  }
}
