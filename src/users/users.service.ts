import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostsService } from 'src/posts/posts.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly postsService: PostsService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const emailExists = await this.userModel.countDocuments({
        email: createUserDto.email,
      });
      if (emailExists) {
        return { error: 'user already exists' };
      }
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

      return { data: users };
    } catch (error) {
      return { error: error.toString() };
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.userModel.findOne({ _id: id });

      return { data: user };
    } catch (error) {
      return { error: error.toString() };
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

  async update(id: number, updateUserDto: UpdateUserDto) {
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

  async follow(userToFollowId: string, currentUserId: string) {
    await this.userModel.updateOne(
      { _id: currentUserId },
      { $addToSet: { following: userToFollowId } },
    );
  }
  async unfollow(userToFollowId: string, currentUserId: string) {
    await this.userModel.updateOne(
      { _id: currentUserId },
      { $pull: { following: userToFollowId } },
    );
  }

  async getFeed(id: string) {
    const following = await (
      await this.userModel.findOne({ _id: id })
    ).following;

    return await this.postsService.feed(following);
  }
}
