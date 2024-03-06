export type StringFields<T> = {
  [key in keyof T]: T[key] extends string ? StringOps<T> : never;
};

export type StringOps<T> = GreaterThanStringOp<T> | LessThanStringOp<T>;

export type GreaterThanStringOp<T> = { $gt: string };
export type LessThanStringOp<T> = { $lt: string };
