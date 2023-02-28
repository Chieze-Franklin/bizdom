import { Domain } from '..';
import { ModelDefinition } from '..';
import { ModelInstance } from '..';

export * from './decorators';
export * from './definitions';
export * from './instances';
export * from './types';

export class Model<T extends ModelDefinition> {
    constructor(public definitionType: (new () => T)) {
        this.definitionType.prototype.__model__ = this;
    }

    private _domain?: Domain;
    get domain(): Domain | undefined {
        return this._domain;
    }
    set domain(domain: Domain | undefined) {
        this._domain = domain;
    }

    private _name?: string;
    get name(): string | undefined {
        return this._name;
    }
    set name(name: string | undefined) {
        this._name = name;
    }

    create(definition: Partial<T>) : T & ModelInstance<T> {
        // if there is no domain or name, throw error (invalid state)
        if (!this.domain) {
            throw new Error('Model has no domain'); // TODO: replace with actual implementation
        }
        if (!this.name) {
            throw new Error('Model has no name'); // TODO: replace with actual implementation
        }

        // run model checks

        // init definition
        const definitionToCreate = new this.definitionType();
        Object.keys(definition).forEach((key: string) => (definitionToCreate as any)[key] = (definition as any)[key]);

        // run pre hooks

        // pass to domain
        this.domain.create(definitionToCreate, { model: this.name });

        // run post hooks

        // return created instance
        const instance : ModelInstance<T> = Object.create(definitionToCreate);
        instance.update = async () => {
            // instance checks ??
            // instance pre hooks
            // pass to model
            // instance post hooks
            return { ok: true, records: 1 };
        }
        instance.delete = async () => {
            // instance checks ??
            // instance pre hooks
            // pass to model
            // instance post hooks
            return { ok: true, records: 1 };
        }

        return instance as T & ModelInstance<T>;
    }
}
