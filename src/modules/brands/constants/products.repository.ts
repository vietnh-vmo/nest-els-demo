import { Brand } from '../entities/brand.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Brand)
export class BrandsRepository extends Repository<Brand> {}
