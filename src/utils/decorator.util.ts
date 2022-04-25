export const AttachClassOrMethodDecorator =
  <T>(methodDecorator) =>
  (someParam?: T): ClassDecorator & MethodDecorator => {
    return (target, key?: string | symbol, descriptor?: PropertyDescriptor) => {
      if (descriptor) {
        return methodDecorator(someParam)(target, key, descriptor);
      }
      for (const targetKey of Object.getOwnPropertyNames(target.prototype)) {
        const targetDescriptor = Object.getOwnPropertyDescriptor(
          target.prototype,
          targetKey,
        );
        if (targetDescriptor) {
          methodDecorator(someParam)(target, targetKey, targetDescriptor);
          Object.defineProperty(target.prototype, targetKey, targetDescriptor);
        }
      }
      return target;
    };
  };
