import { Persisted } from '..';

export type Instance<T> = T & {
  delete(): Promise<Persisted<T>>;
  update(): Promise<Persisted<T>>;
};

export type ID = string | number | bigint | symbol;

export type NullOrUndefined = null | undefined;

export type OperationResult = {
  ok: boolean;
  records: number;
};

export const isID = (value: any): value is ID => {
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'bigint' ||
    typeof value === 'symbol'
  ) {
    return true;
  }
  return false;
};
