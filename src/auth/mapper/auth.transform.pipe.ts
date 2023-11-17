import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { UtilsService } from '../../common/providers/utils/utils.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class HashPasswordPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata): Promise<string> {
    const data = plainToInstance(metatype, value);
    data.password = await UtilsService.hashPassword(value.password);
    return data;
  }
}
