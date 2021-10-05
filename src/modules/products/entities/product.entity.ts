import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseStatus } from '@modules/base/base.interface';
import { Brand } from '@modules/brands/entities/brand.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  status: BaseStatus;

  @Column()
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: null })
  deletedAt: Date;

  @ManyToOne(() => Brand)
  @JoinTable()
  brand: Brand;

  brandId: number;
}
