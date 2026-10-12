import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { OrderItemService } from './orderItem.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('order-item')
export class OrderItemController {
  constructor(private orderItemService: OrderItemService) {}

  // Get all order items (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.orderItemService.getAll();
  }

  // Get single order item by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':orderItem_id')
  async getOne(@Param('orderItem_id') orderItem_id: string) {
    return this.orderItemService.findById(+orderItem_id);
  }

  // Create order item (open - for demo)
  @Post()
  async create(@Body() body: { order_id: string; laptop_id: string; quantity?: number }) {
    return this.orderItemService.createOrderItem(body.order_id, body.laptop_id, body.quantity);
  }

  // Update order item (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':orderItem_id')
  async update(@Param('orderItem_id') orderItem_id: string, @Body() body: any) {
    return this.orderItemService.updateOrderItem(+orderItem_id, body);
  }

  // Delete order item (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':orderItem_id')
  async remove(@Param('orderItem_id') orderItem_id: string) {
    return this.orderItemService.deleteOrderItem(+orderItem_id);
  }
}