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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiBadRequestResponse({ description: 'Bad Request' })
@ApiUnauthorizedResponse({ description: 'UnAuthorized Request' })
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBadRequestResponse({ description: 'Email Already Exists!' })
  @ApiCreatedResponse({ description: 'User Created successfully!' })
  @ApiInternalServerErrorResponse({ description: 'Server Error!' })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return { msg: 'user created', data: user };
  }

  @ApiOkResponse({ description: 'Users fetched!' })
  @Get()
  async findAll(
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
  ) {
    const users = await this.usersService.findAll(offset, limit);
    return { msg: 'users fetched', data: users };
  }

  @ApiOkResponse({ description: 'User profile!' })
  @Get('profile')
  async findProfile(@Req() req: Request) {
    return { msg: 'User Profile', data: req.user };
  }

  // @Get('posts')
  // getPosts(@Req() req: Request) {
  //   return this.usersService.getUserPosts(req.user['id']);
  // }

  @ApiOkResponse({ description: 'User logged in!' })
  @ApiBadRequestResponse({ description: 'incorrect credentials' })
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @ApiOkResponse({ description: 'User Followed' })
  @Post('follow/:id')
  async followUser(@Param('id') id: string, @Req() req: Request) {
    await this.usersService.follow(id, req.user['id']);
    return { msg: `${id} followed`, data: { success: true } };
  }

  @ApiOkResponse({ description: 'User unfollowed' })
  @Post('unfollow/:id')
  async unfollowUser(@Param('id') id: string, @Req() req: Request) {
    await this.usersService.unfollow(id, req.user['id']);
    return { msg: `${id} unfollowed`, data: { success: true } };
  }

  @ApiOkResponse({ description: 'Feed Fetched' })
  @Get('feed')
  async getFeed(@Req() req: Request) {
    const posts = await this.usersService.getFeed(req);
    return { msg: `feed fetched`, data: posts };
  }

  @ApiOkResponse({ description: 'User fetched' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return { msg: 'user fetched', data: user };
  }

  @ApiOkResponse({ description: 'User updated' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersService.update(id, updateUserDto);
    return { msg: 'user updated', data: updatedUser };
  }

  @ApiOkResponse({ description: 'User deleted' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deletedUser = await this.usersService.remove(id);
    return { msg: 'user deleted', data: deletedUser };
  }
}
