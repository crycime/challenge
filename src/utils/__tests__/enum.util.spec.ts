import { getEnumNonNumericValues, getEnumNumericValues } from '../enum.util';
import { SORT_DIRECTION } from '../../constant/common.enum.constant';
enum PLAYER_STATUS {
  key,
  key1,
}

describe('getEnumNumericValues', () => {
  it('should return an array of values that is numeric from the enum provided', () => {
    const result = getEnumNumericValues(PLAYER_STATUS);
    expect(result).toEqual([PLAYER_STATUS.key, PLAYER_STATUS.key1]);
  });
});

describe('getEnumNonNumericValues', () => {
  it('should return an array of values that is non-numeric from the enum provided', () => {
    const result = getEnumNonNumericValues(SORT_DIRECTION);
    expect(result).toEqual([
      SORT_DIRECTION[SORT_DIRECTION.DESC],
      SORT_DIRECTION[SORT_DIRECTION.ASC],
    ]);
  });
});
