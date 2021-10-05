import { UserError } from '@helper/error.helpers';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ListProductsDto } from './dto/list-products.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Brand } from '@modules/brands/entities/brand.entity';
import { BaseElasticIndex } from '../base/base.elastic.service';
import { ElasticSearchDto } from '@modules/search/dto/es-body.dto';
import { ProductsRepository } from './constants/products.repository';
import { BaseStatus, StatusCodes } from '@modules/base/base.interface';
import { BrandsRepository } from '@modules/brands/constants/products.repository';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepo: ProductsRepository,
    @InjectRepository(Brand)
    private readonly brandsRepo: BrandsRepository,
    private readonly productEs: BaseElasticIndex<Product>,
  ) {}

  //  TODO: Apply transaction
  //  handle ES actions failure

  async create(body: CreateProductDto): Promise<Product> {
    const brand = await this.brandsRepo.findOne({ id: body.brandId });

    if (!brand)
      throw new UserError(StatusCodes.BRAND_NOT_FOUND, HttpStatus.NOT_FOUND);

    const product = await this.productsRepo.save({ ...body, brand });

    //  insert ES
    await this.productEs.insertDocument(product, product.id);

    return product;
  }

  async search(listQuery: ListProductsDto): Promise<Product[]> {
    const page = Number(listQuery.page) || 1;
    const size = Number(listQuery.limit) || 20;
    const from = (Number(page) - 1) * Number(size);

    const body: any = {
      body: {
        size,
        from,
        query: {
          bool: {
            must: [
              {
                match: {
                  status: BaseStatus.ACTIVE,
                },
              },
            ],
          },
        },
      } as ElasticSearchDto,
    };

    if (listQuery.search) {
      body.body.query.bool.must.push({
        match: {
          url: listQuery.search,
        },
      });

      body.q = listQuery.search;
    }

    if (listQuery.price) body.body.sort = [{ price: listQuery.price }];

    const data = await this.productEs.searchDocuments(body);

    return data.body.hits.hits;
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepo.findOne(
      { id },
      { relations: ['brand'] },
    );

    if (!product)
      throw new UserError(StatusCodes.PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);

    return product;
  }

  async update(id: number, body: UpdateProductDto): Promise<Product> {
    let product = await this.productsRepo.findOne(
      { id },
      { relations: ['brand'] },
    );

    if (!product)
      throw new UserError(StatusCodes.PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);

    if (String(body.brandId) !== String(product.brandId)) {
      const brand = await this.brandsRepo.findOne({ id: body.brandId });

      if (!brand)
        throw new UserError(StatusCodes.BRAND_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    product = {
      ...product,
      ...body,
    };
    const data = await this.productsRepo.save(product);

    //  update ES
    await this.productEs.updateDocument(product, id);

    return data;
  }

  async remove(id: number): Promise<boolean> {
    const product = await this.productsRepo.findOne(id);

    if (!product)
      throw new UserError(StatusCodes.PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);

    product.deletedAt = new Date();
    const data = await this.brandsRepo.save(product);

    //  delete ES
    await this.productEs.deleteDocument(id);

    return !!data;
  }
}
