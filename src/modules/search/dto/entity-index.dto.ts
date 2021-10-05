import { IsNotEmpty, IsString } from 'class-validator';

export class EntityIndex {
  @IsNotEmpty()
  @IsString()
  _index: string;

  @IsNotEmpty()
  @IsString()
  _type: string;
}
