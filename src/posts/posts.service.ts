import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostDocument } from './schemas/post.schema';
import * as Error from '../common/error.handler';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}
  async create(createPostDto: CreatePostDto & { user: string }) {
    try {
      return await this.postModel.create(createPostDto);
    } catch (error) {
      Error.http400(error.message);
    }
  }

  async findAll(offset: string = '0', limit: string = '0') {
    try {
      const posts = await this.postModel
        .find()
        .sort({ _id: -1 })
        .skip(offset ? parseInt(offset) : 0)
        .limit(limit ? parseInt(limit) : 0);

      return posts;
    } catch (error) {
      Error.http400(error.message);
    }
  }

  async findOne(id: string) {
    try {
      const post = await this.postModel.findOne({ _id: id });
      return post;
    } catch (error) {
      Error.http400(error.message);
    }
  }
  async update(id: string, updatePostDto: UpdatePostDto) {
    try {
      return await this.postModel.findByIdAndUpdate(id, updatePostDto, {
        new: true,
      });
    } catch (error) {
      Error.http400(error.message);
    }
  }

  async remove(id: string) {
    try {
      return await this.postModel.findByIdAndDelete(id);
    } catch (error) {
      Error.http400(error.message);
    }
  }
  async getUserPosts(user: User): Promise<Post[]> {
    try {
      return await this.postModel.find({ user: user }).populate('user');
    } catch (error) {
      Error.http400(error.message);
    }
  }
  async feed(followedUsers: User[]) {
    try {
      return await this.postModel
        .find({ user: { $in: followedUsers } })
        .populate('user');
    } catch (error) {
      Error.http400(error.message);
    }
  }
}
