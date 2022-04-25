import { Transform } from 'class-transformer';

export const ConvertFromId = () => {
  return Transform((value, obj) => value ?? obj?._id, {
    toClassOnly: true,
  });
};
