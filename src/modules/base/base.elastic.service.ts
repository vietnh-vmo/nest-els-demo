import { Injectable } from '@nestjs/common';
import { SearchService } from '@modules/search/search.service';
import { EntityIndex } from '@modules/search/dto/entity-index.dto';

@Injectable()
export class BaseElasticIndex<T> {
  private entityIndex;
  constructor(private readonly searchService: SearchService) {}

  public async createIndex(entityIndex: EntityIndex) {
    await this.searchService.createIndex({ index: entityIndex._index });
    this.entityIndex = entityIndex;
  }

  private bulkIndex(id: number) {
    return {
      _index: this.entityIndex._index,
      _type: this.entityIndex._type,
      _id: id,
    };
  }

  private entityDocument(entity: T, id: number) {
    const bulk = [];
    bulk.push({
      index: this.bulkIndex(id),
    });
    bulk.push(entity);

    return {
      body: bulk,
      index: this.entityIndex._index,
      type: this.entityIndex._type,
    };
  }

  public async searchDocuments(body): Promise<any> {
    const data = {
      index: this.entityIndex._index,
      ...body,
    };
    const res = await this.searchService.searchIndex(data);

    if (!res) return [];

    return res;
  }

  public async insertDocument(entity: T, id: number): Promise<any> {
    const data = this.entityDocument(entity, id);
    return await this.searchService.insertIndex(data);
  }

  public async updateDocument(entity: T, id: number): Promise<any> {
    const data = this.entityDocument(entity, id);
    await this.deleteDocument(id);
    return await this.searchService.insertIndex(data);
  }

  public async deleteDocument(id: number): Promise<any> {
    const data = {
      index: this.entityIndex._index,
      type: this.entityIndex._type,
      id: id.toString(),
    };
    return await this.searchService.deleteDocument(data);
  }
}
