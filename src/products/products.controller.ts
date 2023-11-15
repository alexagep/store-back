import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  IdDto,
  PaginationDto,
  ProductsResponse,
} from './DTO/product.dto';
import { Products } from './products.entity';
import { AuthGuard } from 'src/auth/guard/auth.gaurd';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() body: CreateProductDto): Promise<Products> {
    const result = await this.productsService.create(body);
    return result;
  }

  @Get()
  @UseGuards(AuthGuard)
  async list(paginationDto: PaginationDto): Promise<ProductsResponse> {
    const result = await this.productsService.getAllProducts(paginationDto);
    return result;
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async get(@Param() id: IdDto): Promise<Products> {
    const result = await this.productsService.findById(id);
    return result;
  }
}
