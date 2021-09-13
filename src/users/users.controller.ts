import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';
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
  @UseGuards(JwtAuthGuard)
  async findProfile(@Req() req: Request) {
    const user = await this.usersService.findOne(req.user['userId']);
    return { msg: 'User Profile', data: user };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return { msg: 'user fetched', data: user };
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
}
