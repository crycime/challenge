import { set } from 'lodash';
import { AttachClassOrMethodDecorator } from '../decorator.util';

const methodDecorator = (param): MethodDecorator => {
  return (_target, _propertyKey, descriptor: PropertyDescriptor): void => {
    const fun = descriptor.value;
    descriptor.value = function (): any {
      // eslint-disable-next-line prefer-rest-params
      set(arguments, '0.key', param);
      // eslint-disable-next-line prefer-rest-params
      return fun.apply(this, arguments);
    };
  };
};

const setKey = AttachClassOrMethodDecorator(methodDecorator);

class TestMethodDecorator {
  @setKey('something')
  public test(param) {
    return param;
  }
  public test1(param) {
    return param;
  }
}

@setKey('something')
class TestClassDecorator {
  public test(param) {
    return param;
  }
  public test1(param) {
    return param;
  }
}

describe('AttachClassOrMethodDecorator', () => {
  it('Test Attach Method Decorator', () => {
    const testMethodDecorator = new TestMethodDecorator();
    const data = testMethodDecorator.test({});
    const data1 = testMethodDecorator.test1({});
    expect(data).toEqual({
      key: 'something',
    });
    expect(data1).toEqual({});
  });

  it('Test Attach Class Decorator', () => {
    const testClassDecorator = new TestClassDecorator();
    const data = testClassDecorator.test({});
    const data1 = testClassDecorator.test1({});
    expect(data).toEqual({
      key: 'something',
    });
    expect(data1).toEqual({
      key: 'something',
    });
  });
});
