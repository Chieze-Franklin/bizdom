import { EventEmitter } from 'events';
import { ModelEntityMapper } from './mapper';
import { ModelDefinition } from '../model';

export interface Repository<T extends ModelDefinition> extends EventEmitter {
    constructor(mapper?: ModelEntityMapper<T>): void;
    create(data: T): Promise<T>;
    read(id: string): Promise<T>;
    update(data: T): Promise<T>;
    delete(id: string): Promise<T>;
    list(query: any): Promise<T[]>;
}
