import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostDocument } from './schemas/post.schema';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}
  async create(createPostDto: CreatePostDto) {
    try {
      //will have to add user here to post when adding association
      return await this.postModel.create(createPostDto);
    } catch (error) {
      return { error: error.toString() };
    }
  }

  async findAll(offset: string = '0', limit: string = '0') {
    try {
      const posts = await this.postModel
        .find()
        .sort({ _id: -1 })
        .skip(offset ? parseInt(offset) : 0)
        .limit(limit ? parseInt(limit) : 0);

      return { data: posts };
    } catch (error) {
      return { error: error.toString() };
    }
  }

  async findOne(id: string) {
    try {
      const post = await this.postModel.findOne({ _id: id });

      return { data: post };
    } catch (error) {
      return { error: error.toString() };
    }
  }

  async getFollowersPosts(user: User): Promise<Post[]> {
    return await this.postModel.find({ user: user }).populate({
      path: 'user',
      model: 'users',
      populate: { path: 'following', model: 'users' },
    });
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    try {
      return await this.postModel.findByIdAndUpdate(id, updatePostDto, {
        new: true,
      });
    } catch (error) {
      return { error: error.toString() };
    }
  }

  async remove(id: string) {
    try {
      return await this.postModel.findByIdAndDelete(id);
    } catch (error) {
      return { error: error.toString() };
    }
  }
  async getUserPosts(user: User): Promise<Post[]> {
    return await this.postModel.find({ user: user }).populate('user ');
  }
  async feed(followedUsers: User[]) {
    return await this.postModel
      .find({ user: { $in: followedUsers } })
      .populate('user');
  }
}
