export * from "./number";

import { NumberFields } from "./number";
import { StringFields } from "./string";

export type FilterQuery<T> = NumberFields<T> | SimpleFilterQuery<T> | StringFields<T>;

export type IncludeQuery<T> = {
  [key in keyof T]?: 1 | -1;
};

export type SimpleFilterQuery<T> = Partial<T>;

export type SortQuery<T> = {
  [key in keyof T]?: 1 | -1;
};
