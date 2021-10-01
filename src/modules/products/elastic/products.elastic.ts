import { Injectable } from '@nestjs/common';
import { productIndex } from './products.index';
import { Product } from '../entities/product.entity';
import { SearchService } from '@modules/search/search.service';

@Injectable()
export class ProductElasticIndex {
  constructor(private readonly searchService: SearchService) {}

  private bulkIndex(productId: number) {
    return {
      _index: productIndex._index,
      _type: productIndex._type,
      _id: productId,
    };
  }

  private productDocument(product: Product) {
    const bulk = [];
    bulk.push({
      index: this.bulkIndex(product.id),
    });
    bulk.push(product);

    return {
      body: bulk,
      index: productIndex._index,
      type: productIndex._type,
    };
  }

  public async searchProductDocuments(body): Promise<any> {
    const data = {
      index: productIndex._index,
      ...body,
    };
    const res = await this.searchService.searchIndex(data);

    if (!res) return [];

    return res;
  }

  public async insertProductDocument(product: Product): Promise<any> {
    const data = this.productDocument(product);
    return await this.searchService.insertIndex(data);
  }

  public async updateProductDocument(product: Product): Promise<any> {
    const data = this.productDocument(product);
    await this.deleteProductDocument(product.id);
    return await this.searchService.insertIndex(data);
  }

  public async deleteProductDocument(id: number): Promise<any> {
    const data = {
      index: productIndex._index,
      type: productIndex._type,
      id: id.toString(),
    };
    return await this.searchService.deleteDocument(data);
  }
}
