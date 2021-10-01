import { SortStatus } from '@modules/_base/base.interface';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class ListProductsDto {
  @IsOptional()
  @IsNumberString()
  @ApiProperty({ description: 'page', example: 1 })
  page: number;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({ description: 'limit', example: 5 })
  limit: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'sort price', example: 'asc' })
  price: SortStatus;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'search string', example: 'product' })
  search: string;
}
