import { Inject, Injectable } from '@nestjs/common';
import { Products } from './products.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateProductDto,
  PaginationDto,
  ProductsResponse,
} from './DTO/product.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productRepository: Repository<Products>,

    @Inject(REQUEST)
    private readonly request: Request,
  ) {}

  async create(productInfo: CreateProductDto): Promise<Products> {
    const createdUser = await this.productRepository.create(productInfo);
    return this.productRepository.save(createdUser);
  }

  async getAllProducts(
    paginationDto: PaginationDto,
  ): Promise<ProductsResponse> {
    const [rows, count] = await this.productRepository.findAndCount({
      skip: (paginationDto.page - 1) * (paginationDto.count + 1),
      take: paginationDto.count,
      order: { createdAt: paginationDto.order }, // order can be 'ASC' or 'DESC'
    });
    return {
      rows,
      count,
    };
  }

  async getUsersProducts(
    paginationDto: PaginationDto,
  ): Promise<ProductsResponse> {
    const userId: any = this.request.user.id;

    const [rows, count] = await this.productRepository.findAndCount({
      where: { userId: userId },
      skip: (paginationDto.page - 1) * (paginationDto.count + 1),
      take: paginationDto.count,
      order: { createdAt: paginationDto.order },
    });

    return {
      rows,
      count,
    };
  }
}
