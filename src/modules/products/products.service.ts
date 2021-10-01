import { UserError } from '@helper/error.helpers';
import { Product } from './entities/product.entity';
import { ListProductsDto } from './dto/list-products.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Brand } from '@modules/brands/entities/brand.entity';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ProductElasticIndex } from './elastic/products.elastic';
import { ElasticSearchDto } from '@modules/search/dto/es-body.dto';
import { BaseStatus, StatusCodes } from '@modules/_base/base.interface';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('PRODUCTS')
    private productsRepo: typeof Product,
    @Inject('BRANDS')
    private brandsRepo: typeof Brand,
    private readonly productEs: ProductElasticIndex,
  ) {}

  //  TODO: Apply transaction
  //  handle ES actions failure

  async create(body: CreateProductDto): Promise<Product> {
    const product = await this.productsRepo.create<Product>(body);

    //  insert ES
    const data = await this.productsRepo.findOne<Product>({
      where: { id: product.id },
      include: 'brand',
    });
    await this.productEs.insertProductDocument(data);

    return product;
  }

  async findAll(listQuery: ListProductsDto): Promise<Product[]> {
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

    const data = await this.productEs.searchProductDocuments(body);

    return data.body.hits.hits;
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepo.findOne<Product>({
      where: { id },
      include: 'brand',
    });

    if (!product)
      throw new UserError(StatusCodes.PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);

    return product;
  }

  async update(id: number, body: UpdateProductDto): Promise<Product> {
    const product = await this.productsRepo.findOne<Product>({
      where: { id },
      include: 'brand',
    });

    if (!product)
      throw new UserError(StatusCodes.PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);

    product.set(body);
    const data = await product.save();

    //  update data
    await this.productEs.updateProductDocument(product);

    return data;
  }

  async remove(id: number): Promise<boolean> {
    const product = await this.productsRepo.findOne<Product>({ where: { id } });

    if (!product)
      throw new UserError(StatusCodes.PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);

    const data = !!(await this.productsRepo.destroy({ where: { id } }));

    //  delete ES
    await this.productEs.deleteProductDocument(id);

    return data;
  }
}
