import { UserError } from '@helper/error.helpers';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { EntityManager, getConnection } from 'typeorm';
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

  async create(body: CreateProductDto): Promise<Product> {
    let product;
    const brand = await this.brandsRepo.findOne({
      id: body.brandId,
      deletedAt: null,
    });

    if (!brand)
      throw new UserError(StatusCodes.BRAND_NOT_FOUND, HttpStatus.NOT_FOUND);

    await getConnection().transaction(async (entityManager: EntityManager) => {
      product = await entityManager.save(Product, {
        ...body,
        brand,
      });

      //  insert ES
      await this.productEs.insertDocument(product, product.id);
      return true;
    });

    return (
      product ||
      new UserError(StatusCodes.ES_FAILURE, HttpStatus.INTERNAL_SERVER_ERROR)
    );
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

    return data.body ? data.body.hits.hits : [];
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepo.findOne(
      { id, deletedAt: null },
      { relations: ['brand'] },
    );

    if (!product)
      throw new UserError(StatusCodes.PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);

    return product;
  }

  async update(id: number, body: UpdateProductDto): Promise<Product> {
    let data;
    const product = await this.productsRepo.findOne(
      { id, deletedAt: null },
      { relations: ['brand'] },
    );

    if (!product)
      throw new UserError(StatusCodes.PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);

    if (String(body.brandId) !== String(product.brandId)) {
      const brand = await this.brandsRepo.findOne({ id: body.brandId });

      if (!brand)
        throw new UserError(StatusCodes.BRAND_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    await getConnection().transaction(async (entityManager: EntityManager) => {
      const updateBody = {
        ...product,
        ...body,
      };

      data = await entityManager.save(Product, updateBody);

      //  update ES
      await this.productEs.updateDocument(updateBody, id);
      return true;
    });

    return (
      data ||
      new UserError(StatusCodes.ES_FAILURE, HttpStatus.INTERNAL_SERVER_ERROR)
    );
  }

  async remove(id: number): Promise<boolean> {
    let data;
    const product = await this.productsRepo.findOne({ id, deletedAt: null });

    if (!product)
      throw new UserError(StatusCodes.PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);

    await getConnection().transaction(async (entityManager: EntityManager) => {
      product.deletedAt = new Date();
      data = await entityManager.save(Product, product);

      //  delete ES
      await this.productEs.deleteDocument(id);
      return true;
    });

    return (
      data ||
      new UserError(StatusCodes.ES_FAILURE, HttpStatus.INTERNAL_SERVER_ERROR)
    );
  }
}
