import { Type } from '@nestjs/common';
import { AttachClassOrMethodDecorator } from '../utils/decorator.util';

export function methodDecorator(error: Type): MethodDecorator {
  return (
    target: any,
    key: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    const originalMethod = descriptor.value;
    const errorPoint = `${target.name ?? target.constructor.name} - ${key}`;
    descriptor.value = async function () {
      try {
        // eslint-disable-next-line prefer-rest-params
        return await originalMethod.apply(this, arguments);
      } catch (e) {
        throw new error(`${errorPoint}:${e.message}`);
      }
    };
    return descriptor;
  };
}

export const CatchError = AttachClassOrMethodDecorator<Type>(methodDecorator);
