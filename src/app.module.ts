import { Module } from '@nestjs/common';
import { BrandsModule } from '@modules/brands/brands.module';
import { SearchModule } from '@modules/search/search.module';
import { ProductsModule } from '@modules/products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from '@configs/database.configs';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig()),
    SearchModule,
    ProductsModule,
    BrandsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
