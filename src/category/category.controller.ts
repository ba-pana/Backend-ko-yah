import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  // Get all categories (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.categoryService.getAll();
  }

  // Get single category by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':category_id')
  async getOne(@Param('category_id') category_id: string) {
    return this.categoryService.findById(+category_id);
  }

  // Create category (open - for demo)
  @Post()
  async create(@Body() body: { category_name: string }) {
    return this.categoryService.createCategory(body.category_name);
  }

  // Update category (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':category_id')
  async update(@Param('category_id') category_id: string, @Body() body: any) {
    return this.categoryService.updateCategory(+category_id, body);
  }

  // Delete category (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':category_id')
  async remove(@Param('category_id') category_id: string) {
    return this.categoryService.deleteCategory(+category_id);
  }
}
