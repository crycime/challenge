import { Transform } from 'class-transformer';
import { get, toLower } from 'lodash';

export const ParseBoolean = (key: string) => {
  return Transform(
    (_, obj) => {
      const value = get(obj, key);
      if (typeof value !== 'string') {
        return value;
      } else {
        switch (toLower(value)) {
          case 'true':
            return true;
          case 'false':
            return false;
          default:
            return value;
        }
      }
    },
    { toClassOnly: true },
  );
};
