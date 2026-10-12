import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { BrandModule } from './brand/brand.module';
import { CategoryModule } from './category/category.module';
import { LaptopModule } from './laptop/laptop.module';
import { OrdersModule } from './orders/orders.module';
import { OrderItemModule } from './orderItem/orderItem.module';

@Module({
imports: [DatabaseModule, UsersModule, AuthModule, BrandModule, CategoryModule, LaptopModule, OrdersModule, OrderItemModule],
})

export class AppModule {}