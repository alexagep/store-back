import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  // IdDto,
  PaginationDto,
  ProductsResponse,
} from './DTO/product.dto';
import { Products } from './products.entity';
import { AuthGuard } from 'src/auth/guard/auth.gaurd';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  // @UseGuards(AuthGuard)
  async create(@Body() body: CreateProductDto): Promise<Products> {
    const result = await this.productsService.create(body);
    return result;
  }

  @Get('getAll')
  // @UseGuards(AuthGuard)
  async list(@Body() paginationDto: PaginationDto): Promise<ProductsResponse> {
    const result = await this.productsService.getAllProducts(paginationDto);
    return result;
  }

  @Get('my-products')
  // @UseGuards(AuthGuard)
  async get(@Body() paginationDto: PaginationDto): Promise<ProductsResponse> {
    const result = await this.productsService.getUsersProducts(paginationDto);
    return result;
  }
}
