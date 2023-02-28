import { ModelDefinition } from "..";

export type One<T extends ModelDefinition> = undefined | {
    get(): Promise<T | undefined>;
    set(value: T): void;
};

export type Many<T extends ModelDefinition> = undefined | {
    get(): Promise<Array<T>>;
    set(value: Array<T>): void;
}
