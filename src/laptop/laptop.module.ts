import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LaptopService } from './laptop.service';
import { LaptopController } from './laptop.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [LaptopController],
  providers: [LaptopService],
  exports: [LaptopService],
})

export class LaptopModule {}
