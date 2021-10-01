import { ApiProperty } from '@nestjs/swagger';
import { BaseStatus } from '@modules/_base/base.interface';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'product name', required: true })
  name: string;

  @IsNotEmpty()
  @IsEnum(BaseStatus)
  @ApiProperty({ description: 'product status', required: true })
  status: BaseStatus;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'product price', required: true })
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'product brandId', required: true })
  brandId: number;
}
