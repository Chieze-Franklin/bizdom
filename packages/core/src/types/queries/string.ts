export type StringFields<T> = {
  [key in keyof T]?: T[key] extends string ? StringOps<T> : never;
};

export type StringOps<T> = ArrayStringOp<T> | GreaterThanStringOp<T> | LessThanStringOp<T>;

export type ArrayStringOp<T> = { $in: string[] };
export type GreaterThanStringOp<T> = { $gt: string };
export type LessThanStringOp<T> = { $lt: string };
