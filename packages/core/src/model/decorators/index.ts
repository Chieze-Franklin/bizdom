import { Model, ModelDefinition } from '../.';
import { ID, isID, NullOrUndefined, QueryMeta, QueryParams } from '../..';

// TODO: need to really think about how to handle relationships

export function relationship<T extends ModelDefinition>(name: string, options: { field?: keyof T, many?: boolean, model: string }) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const setOne = async (value: ID | T | NullOrUndefined) => {
            if (!value) {
                descriptor.value = value;
                // TODO: break this relationship
            } else if (isID(value)) {
                descriptor.value = value;
            } else {
                if (options.field) {
                    descriptor.value = (value[options.field] as any)['value'] || value[options.field];
                    // TODO: set value[options.field] to a field in this target (from their relationship)
                    // remember that relationship may not be 2-sided
                }
            }
        };
        const setMany = async (value: Array<ID> | Array<T>) => {
            // TODO
            // if (isID(value)) {
            //     descriptor.value = value;
            // } else {
            //     if (options.field) {
            //         descriptor.value = (value[options.field] as any)['value'] || value[options.field];
            //     }
            // }
        };

        return ({
            ...descriptor,
            ...(!options.many && {
                get: () => ({
                    value: descriptor.value,
                    get: async (params?: Omit<QueryParams, 'model' | 'where'>, meta?: QueryMeta) => {
                        if (!options.field) {
                            return null;
                        }
                        // TODO: run checks
                        const model = (target.__model__ as Model<T>);
                        if (!model) {
                            throw new Error('Not attached to a model'); // TODO: replace with actual implementation
                        }
                        if (!model.domain) {
                            throw new Error('Model has no domain'); // TODO: replace with actual implementation
                        }
                        return model.domain.get<T>({
                            ...params,
                            model: options.model,
                            where: { [options.field]: descriptor.value },
                        }, meta);
                    },
                    set: setOne,
                })
            }),
            ...(options.many && {
                get: () => ({
                    value: descriptor.value,
                    get: async (params?: Omit<QueryParams, 'model' | 'where'>, meta?: QueryMeta) => {
                        if (!options.field) {
                            return [];
                        }
                        // TODO: run checks
                        const model = (target.__model__ as Model<T>);
                        if (!model) {
                            throw new Error('Not attached to a model'); // TODO: replace with actual implementation
                        }
                        if (!model.domain) {
                            throw new Error('Model has no domain'); // TODO: replace with actual implementation
                        }
                        if (!model.name) {
                            throw new Error('Model has no name'); // TODO: replace with actual implementation
                        }
                        return model.domain.getMany<T>({
                            ...params,
                            model: options.model,
                            // TODO: where: { [options.field] in descriptor.value (an array) },
                        }, meta);
                    },
                    set: setMany,
                })
            }),
            set: (value: ID | Array<ID> | T | Array<T> | NullOrUndefined) => {
              if (Array.isArray(value)) {
                setMany(value);
              } else {
                setOne(value);
              }
            }
        });
    }
}