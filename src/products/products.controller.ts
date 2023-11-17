import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  // IdDto,
  PaginationDto,
  ProductsResponse,
} from './DTO/product.dto';
import { Products } from './products.entity';
import { AuthGuard } from 'src/auth/guard/auth.gaurd';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Users } from 'src/users/users.entity';
import { GetUser } from './helper/get-user.decorator';

@Controller('products')
// @UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: CreateProductDto, @GetUser() user: Users): Promise<Products> {
    const result = await this.productsService.create(body, user.id);
    return result;
  }

  @Get('getAll')
  @UseGuards(JwtAuthGuard)
  async list(@Query() paginationDto: PaginationDto): Promise<ProductsResponse> {
    const result = await this.productsService.getAllProducts(paginationDto);
    return result;
  }

  @Get('my-products')
  @UseGuards(JwtAuthGuard)
  async get(@Query() paginationDto: PaginationDto, @GetUser() user: Users): Promise<ProductsResponse> {
    const result = await this.productsService.getUsersProducts(paginationDto, user.id);
    return result;
  }
}
