import { Transform } from 'class-transformer';
import * as _ from 'lodash';

export const SplitString = ({
  uniqueItems = false,
}: { uniqueItems?: boolean } = {}): any => {
  return Transform(
    (value) => {
      const arr = _.isString(value) ? _.split(value, ',') : _.toArray(value);
      return uniqueItems ? _.uniq(arr) : arr;
    },
    { toClassOnly: true },
  );
};
