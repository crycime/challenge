import * as classTransformer from 'class-transformer';
import { Exclude, Expose, plainToClass, Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsString,
  validate,
  ValidateNested,
} from 'class-validator';
import * as classValidator from 'class-validator';
import { omit } from 'lodash';
import {
  classTransformOptions,
  getErrorMsg,
  validateAndTransform,
  validatorOptions,
} from '../validation.util';
import { ValidationErrorException } from '../../exceptions/validationError.exception';

@Exclude()
class TestClass {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsNumber()
  age: number;
}

@Exclude()
class NestedTestClass {
  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestClass)
  data: TestClass[];
}

describe('ValidationUtil', () => {
  describe('getErrorMsg', () => {
    it('should return errorMsg for incorrect object', async () => {
      const response = { name: 'someone', age: 'asdasd' };
      const object = plainToClass(TestClass, response, classTransformOptions);
      const error = await validate(object, validatorOptions);

      const result = getErrorMsg(error);
      expect(result).toMatchSnapshot();
    });

    it('should return error unknown for constraints not found in error object', async () => {
      const response = { name: 'someone', age: 'asdasd' };
      const object = plainToClass(TestClass, response, classTransformOptions);
      const error = await validate(object, validatorOptions);
      error[0].constraints = null;
      const result = getErrorMsg(error);
      expect(result).toMatchSnapshot();
    });

    it('should return errorMsg for incorrect array', async () => {
      const response = { name: 'someone', age: 'xxxxx' };

      const object = plainToClass(TestClass, response, classTransformOptions);
      const error = await validate(object, validatorOptions);
      const result = getErrorMsg([error, []], true);
      expect(result).toMatchSnapshot();
    });

    it('should return errorMsg for incorrect object with nested TestClass', async () => {
      const response = {
        data: [
          { name: 'someone', age: 'xxxxxx' },
          { name: 'other', age: 25 },
        ],
      };
      const object = plainToClass(
        NestedTestClass,
        response,
        classTransformOptions,
      );
      const error = await validate(object, validatorOptions);
      const result = getErrorMsg(error);
      expect(result).toMatchSnapshot();
    });

    it('should return null for empty error message', async () => {
      const response = {
        data: [
          { name: 'someone', age: 'xxxxxx' },
          { name: 'other', age: 25 },
        ],
      };
      const object = plainToClass(
        NestedTestClass,
        response,
        classTransformOptions,
      );
      const error = await validate(object, validatorOptions);
      const errors = [error, []];
      const result = getErrorMsg(errors, true);
      expect(result).toMatchSnapshot();
    });
  });

  describe('validateAndTransform', () => {
    let spyValidateSync;
    let spyPlainToClass;
    let spyClassToPlain;
    beforeEach(() => {
      spyValidateSync = jest.spyOn(classValidator, 'validateSync');
      spyPlainToClass = jest.spyOn(classTransformer, 'plainToClass');
      spyClassToPlain = jest.spyOn(classTransformer, 'classToPlain');
    });

    it('should return response for an object', () => {
      const response = { name: 'someone', age: 18 };
      const classObject = plainToClass(
        TestClass,
        response,
        classTransformOptions,
      );
      const result = validateAndTransform(TestClass, response);
      expect(spyValidateSync).toHaveBeenCalledWith(
        classObject,
        validatorOptions,
      );
      expect(spyPlainToClass).toBeCalledTimes(2);
      expect(spyPlainToClass).toHaveBeenNthCalledWith(
        2,
        TestClass,
        response,
        classTransformOptions,
      );
      expect(spyClassToPlain).toBeCalledWith(classObject);
      expect(result).toEqual(response);
    });

    it('should return response for an array', () => {
      const response = [
        { name: 'someone', age: 18 },
        { name: 'other', age: 25 },
      ];
      const classObject = plainToClass(
        TestClass,
        response,
        classTransformOptions,
      );
      const result = validateAndTransform(TestClass, response);
      expect(spyValidateSync).toHaveBeenCalledTimes(2);
      expect(spyPlainToClass).toBeCalledTimes(2);
      expect(spyPlainToClass).toHaveBeenNthCalledWith(
        2,
        TestClass,
        response,
        classTransformOptions,
      );
      expect(spyClassToPlain).toBeCalledWith(classObject);
      expect(result).toEqual(response);
    });

    it('should remove extra properties not stated in class dto', () => {
      const response = { name: 'someone', age: 18, unknown: 'test' };
      const classObject = plainToClass(
        TestClass,
        response,
        classTransformOptions,
      );
      const result = validateAndTransform(TestClass, response);
      expect(spyValidateSync).toHaveBeenCalledWith(
        classObject,
        validatorOptions,
      );
      expect(spyPlainToClass).toBeCalledTimes(2);
      expect(spyPlainToClass).toHaveBeenNthCalledWith(
        2,
        TestClass,
        response,
        classTransformOptions,
      );
      expect(spyClassToPlain).toBeCalledWith(classObject);
      expect(result).toEqual(omit(response, ['unknown']));
    });

    it('should remove extra properties for object in array not stated in class dto', () => {
      const response = [
        { name: 'someone', age: 18, unknown: 'test' },
        { name: 'other', age: 25 },
      ];
      const classObject = plainToClass(
        TestClass,
        response,
        classTransformOptions,
      );
      const result = validateAndTransform(TestClass, response);
      expect(spyValidateSync).toHaveBeenCalledTimes(2);
      expect(spyPlainToClass).toBeCalledTimes(2);
      expect(spyPlainToClass).toHaveBeenNthCalledWith(
        2,
        TestClass,
        response,
        classTransformOptions,
      );
      expect(spyClassToPlain).toBeCalledWith(classObject);
      expect(result).toEqual([omit(response[0], ['unknown']), response[1]]);
    });

    it('should return response for object with nested TestClass', () => {
      const response = {
        data: [
          { name: 'someone', age: 18 },
          { name: 'other', age: 25 },
        ],
      };
      const classObject = plainToClass(
        NestedTestClass,
        response,
        classTransformOptions,
      );
      const result = validateAndTransform(NestedTestClass, response);
      expect(spyValidateSync).toHaveBeenCalledWith(
        classObject,
        validatorOptions,
      );
      expect(spyPlainToClass).toBeCalledTimes(2);
      expect(spyPlainToClass).toHaveBeenNthCalledWith(
        2,
        NestedTestClass,
        response,
        classTransformOptions,
      );
      expect(spyClassToPlain).toBeCalledWith(classObject);
      expect(result).toEqual(response);
    });

    it('should throw error for an object if age is a string', () => {
      const response = { name: 'someone', age: 'asdasd' };
      const classObject = plainToClass(
        TestClass,
        response,
        classTransformOptions,
      );
      let error;
      try {
        validateAndTransform(TestClass, response);
      } catch (e) {
        error = e;
      }
      expect(spyValidateSync).toHaveBeenCalledWith(
        classObject,
        validatorOptions,
      );
      expect(spyPlainToClass).toHaveBeenCalledWith(
        TestClass,
        response,
        classTransformOptions,
      );
      expect(spyClassToPlain).not.toBeCalled();
      expect(error).toBeInstanceOf(ValidationErrorException);
    });

    it('should throw error for an object if age is a string', () => {
      const response = [
        { name: 'someone', age: 'xxxxx' },
        { name: 'other', age: 25 },
      ];
      let error;
      try {
        validateAndTransform(TestClass, response);
      } catch (e) {
        error = e;
      }
      expect(spyValidateSync).toHaveBeenCalledTimes(2);
      expect(spyPlainToClass).toHaveBeenCalledWith(
        TestClass,
        response,
        classTransformOptions,
      );
      expect(spyClassToPlain).not.toBeCalled();
      expect(error).toBeInstanceOf(ValidationErrorException);
    });

    it('should throw error for an object with nested TestClass if age is a string', () => {
      const response = {
        data: [
          { name: 'someone', age: 'xxxxxx' },
          { name: 'other', age: 25 },
        ],
      };
      const classObject = plainToClass(
        NestedTestClass,
        response,
        classTransformOptions,
      );
      let error;
      try {
        validateAndTransform(NestedTestClass, response);
      } catch (e) {
        error = e;
      }
      expect(spyValidateSync).toHaveBeenCalledWith(
        classObject,
        validatorOptions,
      );
      expect(spyPlainToClass).toHaveBeenCalledWith(
        NestedTestClass,
        response,
        classTransformOptions,
      );
      expect(spyClassToPlain).not.toBeCalled();
      expect(error).toBeInstanceOf(ValidationErrorException);
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
});
