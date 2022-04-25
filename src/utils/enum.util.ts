export const getEnumNumericValues = (enumObj: {
  [key: string]: unknown;
}): number[] =>
  Object.values(enumObj).filter((x) => typeof x === 'number') as number[];

export const getEnumNonNumericValues = (enumObj: {
  [key: string]: unknown;
}): string[] =>
  Object.values(enumObj).filter((x) => typeof x === 'string') as string[];
