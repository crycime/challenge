import { AttachClassOrMethodDecorator } from '../utils/decorator.util';
import { Type } from '@nestjs/common';

export function methodDecorator(): MethodDecorator {
  return (_target: any, _key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function () {
      // eslint-disable-next-line prefer-rest-params
      const response = await originalMethod.apply(this, arguments);
      return JSON.parse(JSON.stringify(response));
    };
    return descriptor;
  };
}

export const ConvertMongoObjectIds =
  AttachClassOrMethodDecorator<Type>(methodDecorator);
