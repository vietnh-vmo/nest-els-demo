import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ElasticSearchDto {
  @IsNotEmpty()
  @IsNumber()
  size: number;

  @IsNotEmpty()
  @IsNumber()
  from: number;

  sort?: any;

  @IsString()
  query?: any;
}
