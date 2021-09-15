import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  Req,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Request } from 'express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    const post = await this.postsService.create({
      ...createPostDto,
      user: req.user['id'],
    });
    return { msg: 'post created', data: post };
  }

  @Get()
  async findAll(
    @Query('offset') offset: string,
    @Query('limit') limit: string,
  ) {
    const posts = await this.postsService.findAll(offset, limit);
    return { msg: 'posts fetched', data: posts };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const post = await this.postsService.findOne(id);
    return { msg: 'post fetched', data: post };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    const post = await this.postsService.update(id, updatePostDto);
    return { msg: 'post updated', data: post };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const post = await this.postsService.remove(id);
    return { msg: 'post deleted', data: post };
  }
}
