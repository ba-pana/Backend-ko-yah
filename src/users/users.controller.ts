import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // Get all users (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.usersService.getAll();
  }

  // Get single user by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':users_id')
  async getOne(@Param('users_id') users_id: string) {
    return this.usersService.findById(+users_id);
  }

  // Create user (open - for demo)
  @Post()
  async create(@Body() body: { username: string; password: string }) {
    return this.usersService.createUser(body.username, body.password);
  }

  // Update user (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':users_id')
  async update(@Param('users_id') users_id: string, @Body() body: any) {
    return this.usersService.updateUser(+users_id, body);
  }

  // Delete user (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':users_id')
  async remove(@Param('users_id') users_id: string) {
    return this.usersService.deleteUser(+users_id);
  }
}