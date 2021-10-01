import { ApiProperty } from '@nestjs/swagger';
import { StatusCodes } from '../base.interface';

export class BaseResponse<T> {
  @ApiProperty({ description: 'status' })
  status: StatusCodes;

  @ApiProperty({ description: 'data', required: true })
  data: T;
}
