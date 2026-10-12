import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { LaptopService } from './laptop.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('laptop')
export class LaptopController {
  constructor(private laptopService: LaptopService) {}

  // Get all laptops (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.laptopService.getAll();
  }

  // Get single laptop by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':laptop_id')
  async getOne(@Param('laptop_id') laptop_id: string) {
    return this.laptopService.findById(+laptop_id);
  }

  // Create laptop (open - for demo)
  @Post()
  async create(@Body() body: { category_id: string; brand_id: string; model_name: string; processor: string; graphics_card: string; laptop_ram: string; laptop_storage: string; screen_size: string; price: number; }) {
    return this.laptopService.createLaptop(
      body.category_id, body.brand_id, body.model_name,
      body.processor, body.graphics_card, body.laptop_ram,
      body.laptop_storage, body.screen_size, body.price,
    );
  }

  // Update laptop (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':laptop_id')
  async update(@Param('laptop_id') laptop_id: string, @Body() body: any) {
    return this.laptopService.updateLaptop(+laptop_id, body);
  }

  // Delete laptop (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':laptop_id')
  async remove(@Param('laptop_id') laptop_id: string) {
    return this.laptopService.deleteLaptop(+laptop_id);
  }
}
