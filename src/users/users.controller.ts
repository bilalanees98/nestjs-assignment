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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return { msg: 'user created', data: user };
  }

  @Get()
  async findAll(
    @Query('offset') offset: string,
    @Query('limit') limit: string,
  ) {
    const users = await this.usersService.findAll(offset, limit);
    return { msg: 'users fetched', data: users };
  }
  @Get('profile')
  async findProfile(@Req() req: Request) {
    // console.log(req.user);
    const user = await this.usersService.findOne(req.user['id']);
    return { msg: 'User Profile', data: user };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return { msg: 'user fetched', data: user };
  }

  @Get('posts/:id')
  getPosts(@Param('id') id: string) {
    return this.usersService.getUserPosts(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersService.update(id, updateUserDto);
    return { msg: 'user updated', data: updatedUser };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deletedUser = await this.usersService.remove(id);
    return { msg: 'user deleted', data: deletedUser };
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
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
