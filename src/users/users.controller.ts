import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query('offset') offset: string, @Query('limit') limit: string) {
    return this.usersService.findAll(offset, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get('posts/:id')
  getPosts(@Param('id') id: string) {
    return this.usersService.getUserPosts(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post('follow/:id/:currentUserId')
  async followUser(
    @Param('id') id: string,
    @Param('currentUserId') currentUserId: string,
  ) {
    await this.usersService.follow(id, currentUserId); //will have to pass loggedin user or their id
    return { msg: `${id} followed`, data: { success: true } };
  }
  @Post('unfollow/:id/:currentUserId')
  async unfollowUser(
    @Param('id') id: string,
    @Param('currentUserId') currentUserId: string,
  ) {
    await this.usersService.unfollow(id, currentUserId); //will have to pass loggedin user or their id
    return { msg: `${id} unfollowed`, data: { success: true } };
  }

  @Get('feed/:id')
  async getFeed(@Param('id') id: string) {
    const posts = await this.usersService.getFeed(id); //will have to pass loggedin user or their id
    return { msg: `feed fetched`, data: posts };
  }
}
