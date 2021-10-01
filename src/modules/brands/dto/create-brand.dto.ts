import { ApiProperty } from '@nestjs/swagger';
import { BaseStatus } from '@modules/_base/base.interface';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateBrandDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'brand name', required: true })
  name: string;

  @IsNotEmpty()
  @IsEnum(BaseStatus)
  @ApiProperty({ description: 'brand status', required: true })
  status: BaseStatus;
}
