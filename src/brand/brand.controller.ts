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
  @Get(':brand_id')
  async getOne(@Param('brand_id') brand_id: string) {
    return this.brandService.findById(+brand_id);
  }

  // Create brand (open - for demo)
  @Post()
  async create(@Body() body: { brand_name: string }) {
    return this.brandService.createBrand(body.brand_name);
  }

  // Update brand (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':brand_id')
  async update(@Param('brand_id') brand_id: string, @Body() body: any) {
    return this.brandService.updateBrand(+brand_id, body);
  }

  // Delete brand (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':brand_id')
  async remove(@Param('brand_id') brand_id: string) {
    return this.brandService.deleteBrand(+brand_id);
  }
}
