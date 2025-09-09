import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':uid')
  async findOne(@Param('uid') uid: string) {
    return this.userService.findOne(uid);
  }

  @Post()
  async create(@Body() createUserDto: any) {
    const { uid, ...userData } = createUserDto;
    return this.userService.create(uid, userData);
  }

  @Put(':uid')
  async update(@Param('uid') uid: string, @Body() updateUserDto: any) {
    return this.userService.update(uid, updateUserDto);
  }

  @Delete(':uid')
  async delete(@Param('uid') uid: string) {
    return this.userService.delete(uid);
  }
}