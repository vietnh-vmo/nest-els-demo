import { Module } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { SearchModule } from '@modules/search/search.module';
import { Brand } from '@modules/brands/entities/brand.entity';
import { ProductElasticIndex } from './elastic/products.elastic';

@Module({
  imports: [SearchModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductElasticIndex,
    {
      provide: 'PRODUCTS',
      useValue: Product,
    },
    {
      provide: 'BRANDS',
      useValue: Brand,
    },
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
