import { Injectable } from '@nestjs/common';
import { Products } from './products.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateProductDto,
  PaginationDto,
  ProductsResponse,
} from './DTO/product.dto';
import { Users } from 'src/users/users.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productRepository: Repository<Products>,
  ) {}

  async create(productInfo: CreateProductDto, user: Users): Promise<Products> {
    try {
      productInfo.userId = user.id;
      const createdUser = await this.productRepository.create(productInfo);

      return this.productRepository.save(createdUser);
    } catch (error) {
      console.log(error);
    }
  }

  async getAllProducts(
    paginationDto: PaginationDto,
  ): Promise<ProductsResponse> {
    const [rows] = await this.productRepository.findAndCount({
      skip: (paginationDto.page - 1) * (paginationDto.count + 1),
      take: paginationDto.count,
      order: { createdAt: paginationDto.order },
    });
    return {
      rows,
      count: rows.length,
    };
  }

  async getUsersProducts(
    paginationDto: PaginationDto,
    userId: string,
  ): Promise<ProductsResponse> {
    const [rows] = await this.productRepository.findAndCount({
      where: { userId: userId },
      skip: (paginationDto.page - 1) * (paginationDto.count + 1),
      take: paginationDto.count,
      order: { createdAt: paginationDto.order },
    });

    return {
      rows,
      count: rows.length,
    };
  }
}
