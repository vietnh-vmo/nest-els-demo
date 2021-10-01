import { Brand } from './entities/brand.entity';
import { UserError } from '@helper/error.helpers';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { StatusCodes } from '@modules/_base/base.interface';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class BrandsService {
  constructor(
    @Inject('BRANDS')
    private brandsRepo: typeof Brand,
  ) {}

  async create(body: CreateBrandDto): Promise<Brand> {
    return await this.brandsRepo.create<Brand>(body);
  }

  async findAll(): Promise<Brand[]> {
    return await this.brandsRepo.findAll<Brand>();
  }

  async findOne(id: number): Promise<Brand> {
    const brand = await this.brandsRepo.findOne<Brand>({ where: { id } });

    if (!brand)
      throw new UserError(StatusCodes.BRAND_NOT_FOUND, HttpStatus.NOT_FOUND);

    return brand;
  }

  async update(id: number, body: UpdateBrandDto): Promise<Brand> {
    const brand = await this.brandsRepo.findOne<Brand>({ where: { id } });

    if (!brand)
      throw new UserError(StatusCodes.BRAND_NOT_FOUND, HttpStatus.NOT_FOUND);

    brand.set(body);
    return await brand.save();
  }

  async delete(id: number): Promise<boolean> {
    const brand = await this.brandsRepo.findOne<Brand>({ where: { id } });

    if (!brand)
      throw new UserError(StatusCodes.BRAND_NOT_FOUND, HttpStatus.NOT_FOUND);

    return !!(await this.brandsRepo.destroy({ where: { id } }));
  }
}
