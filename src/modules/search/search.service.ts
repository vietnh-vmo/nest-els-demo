import { UserError } from '@helper/error.helpers';
import { HttpStatus, Injectable } from '@nestjs/common';
import { StatusCodes } from '@modules/base/base.interface';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  constructor(private readonly esService: ElasticsearchService) {}

  async insertIndex(bulkData: any): Promise<any> {
    const data = await this.esService.bulk(bulkData);

    if (!data)
      throw new UserError(
        StatusCodes.FAILURE,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return data;
  }

  async updateIndex(updateData: any): Promise<any> {
    const data = await this.esService.update(updateData);

    if (!data)
      throw new UserError(
        StatusCodes.FAILURE,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return data;
  }

  async searchIndex(searchData: any): Promise<any> {
    const data = await this.esService.search(searchData);

    if (!data)
      throw new UserError(
        StatusCodes.FAILURE,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return data;
  }

  async deleteIndex(indexData: any): Promise<any> {
    const data = await this.esService.indices.delete(indexData);

    if (!data)
      throw new UserError(
        StatusCodes.FAILURE,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return data;
  }

  async deleteDocument(indexData: any): Promise<any> {
    const data = await this.esService.delete(indexData);

    if (!data)
      throw new UserError(
        StatusCodes.FAILURE,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return data;
  }
}
