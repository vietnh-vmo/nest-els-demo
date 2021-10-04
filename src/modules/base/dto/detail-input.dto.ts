import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DetailInput {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'objectId', required: true })
  id: string;
}
