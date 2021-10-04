import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { UserError } from '@helper/error.helpers';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { StatusCodes } from '@modules/base/base.interface';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandsRepo: Repository<Brand>,
  ) {}

  async create(body: CreateBrandDto): Promise<Brand> {
    return await this.brandsRepo.save(body);
  }

  async findAll(): Promise<Brand[]> {
    return await this.brandsRepo.find();
  }

  async findOne(id: number): Promise<Brand> {
    const brand = await this.brandsRepo.findOne(id);

    if (!brand)
      throw new UserError(StatusCodes.BRAND_NOT_FOUND, HttpStatus.NOT_FOUND);

    return brand;
  }

  async update(id: number, body: UpdateBrandDto): Promise<Brand> {
    let brand = await this.brandsRepo.findOne(id);

    if (!brand)
      throw new UserError(StatusCodes.BRAND_NOT_FOUND, HttpStatus.NOT_FOUND);

    brand = {
      ...brand,
      ...body,
    };
    return await this.brandsRepo.save(brand);
  }

  async delete(id: number): Promise<boolean> {
    const brand = await this.brandsRepo.findOne(id);

    if (!brand)
      throw new UserError(StatusCodes.BRAND_NOT_FOUND, HttpStatus.NOT_FOUND);

    const data = await this.brandsRepo.remove(brand);

    console.log(data);

    return !!data;
  }
}
