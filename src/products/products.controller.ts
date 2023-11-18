import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  // IdDto,
  PaginationDto,
  ProductsResponse,
} from './DTO/product.dto';
import { Products } from './products.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Users } from 'src/users/users.entity';
import { GetUser } from './helper/get-user.decorator';
import { EmailVerificationGuard } from 'src/auth/guard/validateEmail.guard';

@Controller('products')
@UseGuards(JwtAuthGuard, EmailVerificationGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(
    @Body() body: CreateProductDto,
    @GetUser() user: Users,
  ): Promise<Products> {
    const result = await this.productsService.create(body, user);
    return result;
  }

  @Get('getAll')
  async list(@Query() paginationDto: PaginationDto): Promise<ProductsResponse> {
    const result = await this.productsService.getAllProducts(paginationDto);
    return result;
  }

  @Get('my-products')
  async get(
    @Query() paginationDto: PaginationDto,
    @GetUser() user: Users,
  ): Promise<ProductsResponse> {
    const result = await this.productsService.getUsersProducts(
      paginationDto,
      user.id,
    );
    return result;
  }
}
