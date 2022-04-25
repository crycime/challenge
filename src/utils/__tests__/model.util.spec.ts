import * as _ from 'lodash';
import {
  generateBaseFilter,
  generateKeywordFilter,
  generateQueryBaseOption,
  transformUpdateObject,
} from '../model.util';
import { omitByDeep } from '../validation.util';

describe('ModelUtil', () => {
  describe('generateBaseFilter', () => {
    it('should transform to mongodb filter by modelIds', async () => {
      const testData = { testIds: ['testId'] };
      const object = generateBaseFilter(testData, 'test');
      expect(object).toEqual({ _id: { $in: ['testId'] } });
    });

    it('should transform to mongodb filter by modelNos', async () => {
      const testData = { testNos: ['testNo'] };
      const object = generateBaseFilter(testData, 'test');
      expect(object).toEqual({ testNo: { $in: ['testNo'] } });
    });
  });

  describe('generateQueryBaseOption', () => {
    it('should transform to mongodb paging query', async () => {
      const testData = { page: 2, pageSize: 10 };
      const object = generateQueryBaseOption(testData);
      expect(object).toMatchSnapshot();
    });
    it('should transform to mongodb sort descending query', async () => {
      const testData = {
        page: 2,
        pageSize: 10,
        sortBy: 'test',
        sortDirection: 'desc',
      };
      const object = generateQueryBaseOption(testData);
      expect(object).toMatchSnapshot();
    });
    it('should transform to mongodb sort ascending query', async () => {
      const testData = {
        page: 2,
        pageSize: 10,
        sortBy: 'test',
        sortDirection: 'asc',
      };
      const object = generateQueryBaseOption(testData);
      expect(object).toMatchSnapshot();
    });
  });

  describe('transformUpdateObject', () => {
    it('should unset key if value is null', async () => {
      const object = transformUpdateObject({ key1: 1, key2: null }, ['key2']);
      expect(object).toMatchSnapshot();
    });
    it('should unset keys if value is null', async () => {
      const object = transformUpdateObject({ key1: null, key2: null }, [
        'key1',
        'key2',
      ]);
      expect(object).toMatchSnapshot();
    });
    it('should not unset key if value is not null', async () => {
      const object = transformUpdateObject({ key1: 'test', key2: null }, [
        'key1',
        'key2',
      ]);
      expect(object).toMatchSnapshot();
    });
    it('should not unset key if not included in removeKeys', async () => {
      const object = transformUpdateObject({ key1: null, key2: null }, [
        'key2',
      ]);
      expect(object).toMatchSnapshot();
    });
    it('should transform and unset embed key', async () => {
      const object = transformUpdateObject(
        {
          useCorporateCreator: true,
          description: null,
          corporateCreator: {
            BRFileId: { demo: null },
            logoImageFileId: null,
            name: 'name',
          },
        },
        [
          'corporateCreator.BRFileId',
          'corporateCreator.BRFileId.demo',
          'corporateCreator.logoImageFileId',
          'description',
        ],
      );
      expect(object).toEqual({
        useCorporateCreator: true,
        $unset: {
          description: '',
          'corporateCreator.BRFileId.demo': '',
          'corporateCreator.logoImageFileId': '',
        },
        'corporateCreator.name': 'name',
      });
    });
  });

  describe('generateKeywordFilter', () => {
    it('should return Keyword filter', async () => {
      const object = generateKeywordFilter({}, 'test', ['key1', 'key2']);
      expect(object).toEqual({
        $or: [
          { key1: { $regex: 'test', $options: 'i' } },
          { key2: { $regex: 'test', $options: 'i' } },
        ],
      });
    });

    it('should return Keyword filter if has `$or` filter', async () => {
      const object = generateKeywordFilter(
        { $or: [{ demo: 'test' }] },
        'test',
        ['key1', 'key2'],
      );
      expect(object).toEqual({
        $or: [
          { demo: 'test' },
          { key1: { $regex: 'test', $options: 'i' } },
          { key2: { $regex: 'test', $options: 'i' } },
        ],
      });
    });
  });

  describe('omitByDeep', () => {
    it('should omit by deep with undefined ', async () => {
      const obj = {
        key1: undefined,
        key2: null,
        key3: 10,
        key4: 'Test',
        key5: '',
        key6: {
          a: [
            {
              n: 'Test1',
              i: 248,
            },
            {
              n: 'Test2',
              i: undefined,
            },
          ],
          b: 'Test3',
          c: undefined,
          d: {
            n: 'Test2',
            i: undefined,
          },
        },
      };
      const object = omitByDeep(obj, _.isUndefined);
      expect(object).toEqual({
        key2: null,
        key3: 10,
        key4: 'Test',
        key5: '',
        key6: {
          a: [
            {
              n: 'Test1',
              i: 248,
            },
            {
              n: 'Test2',
            },
          ],
          b: 'Test3',
          d: {
            n: 'Test2',
          },
        },
      });
    });
    it('should omit by deep with number ', async () => {
      const obj = {
        key1: undefined,
        key2: null,
        key3: 10,
        key4: 'Test',
        key5: '',
        key6: {
          a: [
            {
              n: 'Test1',
              i: 10,
            },
            {
              n: 'Test2',
              i: undefined,
            },
          ],
          b: 'Test3',
          c: 10,
          d: {
            n: 'Test2',
            i: 10,
          },
        },
      };
      const object = omitByDeep(obj, _.isNumber);
      expect(object).toEqual({
        key1: undefined,
        key2: null,
        key4: 'Test',
        key5: '',
        key6: {
          a: [
            {
              n: 'Test1',
            },
            {
              n: 'Test2',
              i: undefined,
            },
          ],
          b: 'Test3',
          d: {
            n: 'Test2',
          },
        },
      });
    });
    it('should omit by deep with custom ', async () => {
      const obj = {
        key1: undefined,
        key2: null,
        key3: 10,
        key4: 'customTest',
        key5: '',
        key6: {
          a: [
            {
              n: 'Test1',
              i: 'customTest',
            },
            {
              n: 'Test2',
              i: 'customTest',
            },
          ],
          b: 'Test3',
          c: 'customTest',
          d: {
            n: 'Test2',
            i: 'customTest',
          },
        },
      };
      const object = omitByDeep(obj, (value) => value === 'customTest');
      expect(object).toEqual({
        key1: undefined,
        key2: null,
        key3: 10,
        key5: '',
        key6: {
          a: [
            {
              n: 'Test1',
            },
            {
              n: 'Test2',
            },
          ],
          b: 'Test3',
          d: {
            n: 'Test2',
          },
        },
      });
    });
  });
});
