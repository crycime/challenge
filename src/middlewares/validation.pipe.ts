import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  Type,
} from '@nestjs/common';

import { includes } from 'lodash';
import { validateAndTransform } from '../utils/validation.util';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  transform(
    value: any,
    metadata: ArgumentMetadata,
  ): Record<string, unknown> | any[] {
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    return validateAndTransform(metatype, value);
  }

  private toValidate(metatype: Type<any>): boolean {
    const typesToSkip = [String, Boolean, Number, Array, Object];
    return !includes(typesToSkip, metatype);
  }
}
