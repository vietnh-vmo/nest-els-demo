import { ApiProperty } from '@nestjs/swagger';
import { StatusCodes } from '../base.interface';

export class BooleanResponse {
  @ApiProperty({ description: 'status', required: true })
  status: StatusCodes;

  @ApiProperty({ description: 'data', required: true })
  data: boolean;
}
