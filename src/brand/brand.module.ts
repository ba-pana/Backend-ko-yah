import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [BrandController],
  providers: [BrandService],
  exports: [BrandService],
})

export class BrandModule {}
