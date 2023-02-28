import { ModelDefinition } from '..';

export interface DataAccessObject {
    addModel<T extends ModelDefinition>(name: string, definition: T): void;
}
