import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';
import { Module, OnModuleInit } from '@nestjs/common';
import { productIndex } from './constants/products.index';
import { ProductsController } from './products.controller';
import { SearchModule } from '@modules/search/search.module';
import { Brand } from '@modules/brands/entities/brand.entity';
import { BaseElasticIndex } from '../base/base.elastic.service';
import { ProductsRepository } from './constants/products.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Brand]), SearchModule],
  controllers: [ProductsController],
  providers: [ProductsService, BaseElasticIndex, ProductsRepository],
  exports: [ProductsService],
})
export class ProductsModule implements OnModuleInit {
  constructor(private readonly productEs: BaseElasticIndex<Product>) {}
  onModuleInit() {
    this.productEs.createIndex(productIndex);
  }
}
