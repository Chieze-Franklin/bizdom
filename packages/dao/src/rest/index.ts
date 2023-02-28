import { DataAccessObject, ModelDefinition } from '@datadom/core';

export class RestApiDataAccessObject implements DataAccessObject {
    models: Map<string, ModelDefinition> = new Map();

    addModel<T extends ModelDefinition>(name: string, definition: T): void {
        this.models.set(name, definition);
    }
}