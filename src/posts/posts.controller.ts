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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiBadRequestResponse({ description: 'Bad Request' })
@ApiUnauthorizedResponse({ description: 'UnAuthorized Request' })
@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOkResponse({ description: 'post created' })
  @Post()
  async create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    const post = await this.postsService.create(
      {
        ...createPostDto,
        user: req.user['_id'],
      },
      req,
    );
    return { msg: 'post created', data: post };
  }

  @ApiOkResponse({ description: 'posts fetched' })
  @Get()
  async findAll(
    @Query('offset') offset: string,
    @Query('limit') limit: string,
  ) {
    const posts = await this.postsService.findAll(offset, limit);
    return { msg: 'posts fetched', data: posts };
  }

  @ApiOkResponse({ description: 'post fetched' })
  @Get(':id')
  async findOne(@Req() req: Request) {
    const post = await this.postsService.findOne(req.params['id'], req);
    return { msg: 'post fetched', data: post };
  }

  @ApiOkResponse({ description: 'post updated' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    const post = await this.postsService.update(id, updatePostDto);
    return { msg: 'post updated', data: post };
  }

  @ApiOkResponse({ description: 'post deleted' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const post = await this.postsService.remove(id);
    return { msg: 'post deleted', data: post };
  }
}
