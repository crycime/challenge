import { Transform } from 'class-transformer';
import { get, isString } from 'lodash';

export const ConvertDate = (key: string) => {
  return Transform(
    (_, obj) => {
      const date = get(obj, key);
      return isString(date) ? new Date(date).getTime() : date;
    },
    { toClassOnly: true },
  );
};
