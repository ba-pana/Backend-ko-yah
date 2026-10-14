import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { BrandService } from './brand.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('brand')
export class BrandController {
  constructor(private brandService: BrandService) {}

  // Get all brands (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.brandService.getAll();
  }

  // Get single brand by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.brandService.findById(+id);
  }

  // Create brand (open - for demo)
  @Post()
  async create(@Body() body: { brand_name: string }) {
    return this.brandService.createBrand(body.brand_name);
  }

  // Update brand (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.brandService.updateBrand(+id, body);
  }

  // Delete brand (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.brandService.deleteBrand(+id);
  }
}
