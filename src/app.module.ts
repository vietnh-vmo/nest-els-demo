import { Module } from '@nestjs/common';
import { BrandsModule } from '@modules/brands/brands.module';
import { SearchModule } from '@modules/search/search.module';
import { ProductsModule } from '@modules/products/products.module';
import { DatabaseModule } from '@modules/database/database.module';

@Module({
  imports: [DatabaseModule, SearchModule, ProductsModule, BrandsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
