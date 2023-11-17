import { Inject, Injectable } from '@nestjs/common';
import { Products } from './products.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateProductDto,
  PaginationDto,
  ProductsResponse,
} from './DTO/product.dto';
// import { REQUEST } from '@nestjs/core';
// import { Request } from 'express';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productRepository: Repository<Products>,
  ) {}

  async create(productInfo: CreateProductDto, userId: string): Promise<Products> {
    try {
      productInfo.userId = userId;
      const createdUser = await this.productRepository.create(productInfo);

      return this.productRepository.save(createdUser);
    }
    catch(error){
      console.log(error)
    }
  }

  async getAllProducts(
    paginationDto: PaginationDto,
  ): Promise<ProductsResponse> {
    const [rows] = await this.productRepository.findAndCount({
      skip: (paginationDto.page - 1) * (paginationDto.count + 1),
      take: paginationDto.count,
      order: { createdAt: paginationDto.order }, // order can be 'ASC' or 'DESC'
    });
    return {
      rows,
      count: rows.length,
    };
  }

  async getUsersProducts(
    paginationDto: PaginationDto,
    userId: string
  ): Promise<ProductsResponse> {
    console.log(paginationDto)
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
