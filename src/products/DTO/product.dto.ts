import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Products } from '../products.entity'; // assuming you have a Products entity class

export interface ProductsResponse {
  rows: Products[];
  count: number;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  userId?: string;
}

export class UpdateProductDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}

export class IdDto {
  @IsString()
  id: string;
}

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PaginationDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly count?: number = 10;

  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.ASC;
}
