import {
  Get,
  Put,
  Post,
  Body,
  Param,
  Delete,
  Controller,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { StatusCodes } from '@modules/_base/base.interface';
import { BaseResponse } from '@modules/_base/dto/base-response.dto';
import { ListResponse } from '@modules/_base/dto/list-response.dto';
import { BooleanResponse } from '@modules/_base/dto/bool-response.dto';
import { ListProductsDto } from './dto/list-products.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() body: CreateProductDto): Promise<BaseResponse<Product>> {
    const data = await this.productsService.create(body);

    return {
      status: StatusCodes.SUCCESS,
      data,
    };
  }

  @Get()
  async findAll(
    @Query() query: ListProductsDto,
  ): Promise<ListResponse<Product>> {
    const data = await this.productsService.findAll(query);

    return {
      status: StatusCodes.SUCCESS,
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BaseResponse<Product>> {
    const data = await this.productsService.findOne(+id);

    return {
      status: StatusCodes.SUCCESS,
      data,
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<BaseResponse<Product>> {
    const data = await this.productsService.update(+id, updateProductDto);

    return {
      status: StatusCodes.SUCCESS,
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<BooleanResponse> {
    const data = await this.productsService.remove(+id);

    return {
      status: StatusCodes.SUCCESS,
      data,
    };
  }
}
