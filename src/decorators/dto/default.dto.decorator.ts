import { Transform } from 'class-transformer';
import { isNil } from 'lodash';

export const Default = (defaultValue: any) => {
  return Transform((value) => (!isNil(value) ? value : defaultValue), {
    toClassOnly: true,
  });
};
