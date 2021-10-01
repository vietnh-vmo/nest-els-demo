import {
  Get,
  Put,
  Post,
  Body,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';
import { Brand } from './entities/brand.entity';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { StatusCodes } from '@modules/_base/base.interface';
import { BaseResponse } from '@modules/_base/dto/base-response.dto';
import { ListResponse } from '@modules/_base/dto/list-response.dto';
import { BooleanResponse } from '@modules/_base/dto/bool-response.dto';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  async create(@Body() body: CreateBrandDto): Promise<BaseResponse<Brand>> {
    const data = await this.brandsService.create(body);

    return {
      status: StatusCodes.SUCCESS,
      data,
    };
  }

  @Get()
  async findAll(): Promise<ListResponse<Brand>> {
    const data = await this.brandsService.findAll();

    return {
      status: StatusCodes.SUCCESS,
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BaseResponse<Brand>> {
    const data = await this.brandsService.findOne(+id);

    return {
      status: StatusCodes.SUCCESS,
      data,
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateBrandDto,
  ): Promise<BaseResponse<Brand>> {
    const data = await this.brandsService.update(+id, body);

    return {
      status: StatusCodes.SUCCESS,
      data,
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<BooleanResponse> {
    const data = await this.brandsService.delete(+id);

    return {
      status: StatusCodes.SUCCESS,
      data,
    };
  }
}
