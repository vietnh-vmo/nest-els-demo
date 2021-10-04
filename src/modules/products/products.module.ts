import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { SearchModule } from '@modules/search/search.module';
import { ProductElasticIndex } from './elastic/products.elastic';
import { Brand } from '@modules/brands/entities/brand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Brand]), SearchModule],
  controllers: [ProductsController],
  providers: [ProductsService, ProductElasticIndex],
  exports: [ProductsService],
})
export class ProductsModule {}
