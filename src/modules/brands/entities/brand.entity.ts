import { BaseStatus } from '@modules/_base/base.interface';
import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Brand extends Model {
  @Column
  name: string;

  @Column
  status: BaseStatus;
}
