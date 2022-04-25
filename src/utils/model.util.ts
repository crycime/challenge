import { DocumentQuery, ModelPopulateOptions } from 'mongoose';
import * as _ from 'lodash';

interface GenerateQueryBaseOptionInputInterface {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: string;
}

export const populateHelper = <T>(
  docsQuery: DocumentQuery<T>,
  populates: ModelPopulateOptions[],
): DocumentQuery<T> => {
  if (populates) {
    populates.forEach((populateOption: ModelPopulateOptions) => {
      docsQuery.populate(populateOption);
    });
  }
  return docsQuery;
};

export const transformUpdateObject = (
  update: Record<string, unknown>,
  removeKeys: string[],
): any => {
  const newUpdate = {};
  const transformKeys = (value: any, obj: any, key?: string) => {
    _.forEach(value, (value1, key1) => {
      const newKey = key ? `${key}.${key1}` : key1;
      if (value1 && _.isPlainObject(value1)) {
        transformKeys(value1, obj, newKey);
      } else {
        obj[newKey] = value1;
      }
    });
  };
  transformKeys(update, newUpdate);
  return _.transform(
    newUpdate,
    // no need to return because iteratee functions may exit iteration early by explicitly returning false
    (result: Record<string, unknown>, value: any, key: string) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      _.isNull(value) && _.includes(removeKeys, key)
        ? _.set(result, `$unset["${key}"]`, '')
        : (result[key] = value);
    },
    {},
  );
};

export const generateBaseFilter = (param: any, modelName: string) => {
  const ids = _.get(param, `${modelName}Ids`, []);
  const nos = _.get(param, `${modelName}Nos`, []);
  return {
    ...(!_.isEmpty(ids) ? { _id: { $in: ids } } : {}),
    ...(!_.isEmpty(nos) ? { [`${modelName}No`]: { $in: nos } } : {}),
  };
};

export const generateQueryBaseOption = ({
  page,
  pageSize,
  sortBy,
  sortDirection,
}: GenerateQueryBaseOptionInputInterface) => ({
  pageSize,
  ...(sortBy && sortDirection
    ? {
        sort: { [sortBy]: sortDirection === 'DESC' ? -1 : 1 },
        collation: { locale: 'en' },
      }
    : {}),
  skip: (page - 1) * pageSize,
});

export const generateKeywordFilter = (
  filter: Record<string, any>,
  keyword: string,
  searchFileds: string[],
) => {
  const keywordRegex = { $regex: keyword, $options: 'i' };
  const tmpArray = [];
  searchFileds.forEach((e) => {
    tmpArray.push({
      [e]: keywordRegex,
    });
  });
  return _.set(
    filter,
    '$or',
    _.get(filter, '$or', null) ? [...filter.$or, ...tmpArray] : tmpArray,
  );
};
