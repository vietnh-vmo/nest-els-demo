import {
  Get,
  Put,
  Post,
  Body,
  Param,
  Query,
  Delete,
  Controller,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';
import { ListProductsDto } from './dto/list-products.dto';
import { StatusCodes } from '@modules/base/base.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BaseResponse } from '@modules/base/dto/base-response.dto';
import { ListResponse } from '@modules/base/dto/list-response.dto';
import { BooleanResponse } from '@modules/base/dto/bool-response.dto';

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
    const data = await this.productsService.search(query);

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
