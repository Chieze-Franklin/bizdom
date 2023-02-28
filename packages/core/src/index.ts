export * from './dao';
export * from './domain';
export * from './model';

export type ID = string | number;

export type NullOrUndefined = null | undefined;

export type OperationResult = {
  ok: boolean;
  records: number;
};

export const isID = (value: any): value is ID => {
  if (typeof value === 'string' || typeof value === 'number') {
    return true;
  }
  return false;
};
