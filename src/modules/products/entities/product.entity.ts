import {
  Table,
  Model,
  Column,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { BaseStatus } from '@modules/_base/base.interface';
import { Brand } from '@modules/brands/entities/brand.entity';

@Table
export class Product extends Model {
  @Column
  name: string;

  @Column
  status: BaseStatus;

  @Column
  price: number;

  @ForeignKey(() => Brand)
  @Column
  brandId: number;

  @BelongsTo(() => Brand, 'brandId')
  brand: Brand;
}
