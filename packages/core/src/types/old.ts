export type One<T> =
  | undefined
  | {
      get(): Promise<T | undefined>;
      set(value: T): void;
    };

export type Many<T> =
  | undefined
  | {
      get(): Promise<T[]>;
      set(value: T[]): void;
    };
