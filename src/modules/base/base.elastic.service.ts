import { StatusCodes } from './base.interface';
import { UserError } from '@helper/error.helpers';
import { HttpStatus, Injectable } from '@nestjs/common';
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
    try {
      const data = {
        index: this.entityIndex._index,
        ...body,
      };
      const res = await this.searchService.searchIndex(data);

      return res;
    } catch (error) {
      return [];
    }
  }

  public async insertDocument(entity: T, id: number): Promise<any> {
    try {
      const data = this.entityDocument(entity, id);
      const res = await this.searchService.insertIndex(data);
      return res;
    } catch (error) {
      throw new UserError(
        StatusCodes.ES_FAILURE,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async updateDocument(entity: T, id: number): Promise<any> {
    try {
      const data = this.entityDocument(entity, id);
      await this.deleteDocument(id);
      return await this.searchService.insertIndex(data);
    } catch (error) {
      throw new UserError(
        StatusCodes.ES_FAILURE,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async deleteDocument(id: number): Promise<any> {
    try {
      const data = {
        index: this.entityIndex._index,
        type: this.entityIndex._type,
        id: id.toString(),
      };
      return await this.searchService.deleteDocument(data);
    } catch (error) {
      throw new UserError(
        StatusCodes.ES_FAILURE,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
