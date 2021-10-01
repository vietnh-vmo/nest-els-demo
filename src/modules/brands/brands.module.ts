import { Module } from '@nestjs/common';
import { Brand } from './entities/brand.entity';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';

@Module({
  controllers: [BrandsController],
  providers: [
    BrandsService,
    {
      provide: 'BRANDS',
      useValue: Brand,
    },
  ],
  exports: [BrandsModule],
})
export class BrandsModule {}
