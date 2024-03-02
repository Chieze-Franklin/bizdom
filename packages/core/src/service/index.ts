import { EventEmitter } from 'events';
import { Domain } from "../domain";
import { IQueryBuilder, IRepository } from "../repository";
import { Instance, OperationResult, SaveInput, UpdateInput } from "../types";

export interface IService<T> extends IRepository<T>, EventEmitter {
    // constructor(repository: IRepository<T>): void;
    create(data: SaveInput<T>): Promise<T>;
    createInstance(data: SaveInput<T>): Promise<Instance<T>>;
}

export type ServiceFunction<T> = (data: SaveInput<T>) => Promise<T>;

export class Service<T> implements IService<T> {
    constructor(public repository: IRepository<T>) {
        (this as any).prototype = Object.create(repository);
        // this.createProxyMethods(repository);
    }

    private _eventListeners: Record<string, Function[]> = {};
    private _onceListeners: Record<string, Function[]> = {};

    private _rules: Partial<Record<keyof IRepository<T>, Function[]>> = {};
    private _onceRules: Partial<Record<keyof IRepository<T>, Function[]>> = {};

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

    create(data: SaveInput<T>): Promise<T> {
        return this.save(data);
    }
    async createInstance(data: SaveInput<T>): Promise<Instance<T>> {
        const model = await this.save(data);
        const instance: Instance<T> = {
            ...model,
            update: async () => {
                const id = (model as any)['id'];
                if (!id) {
                    throw new Error("Instance does not have an id");
                }
                return this.update(id as string, model as UpdateInput<T>);
            },
            delete: async () => {
                const id = (model as any)['id'];
                if (!id) {
                    throw new Error("Instance does not have an id");
                }
                return this.delete(id as string);
            }
        } as any;

        return instance;
    }

    delete(id: string): Promise<OperationResult> {
        const result = this.repository.delete(id);
        return result;
    }
    deleteMany(params: IQueryBuilder<T>): Promise<OperationResult> {
        throw new Error("Method not implemented.");
    }
    get(id: string): Promise<T | null> {
        throw new Error("Method not implemented.");
    }
    getMany(params: IQueryBuilder<T>): Promise<T[]> {
        throw new Error("Method not implemented.");
    }
    async save(data: SaveInput<T>): Promise<T> {
        this.emit("saving", {
            input: data,
            repository: this.repository,
            domain: this.domain,
            serviceName: this.name
        });

        await this.domain?.runRules("save", {
            input: data,
            repository: this.repository,
            domain: this.domain,
            serviceName: this.name
        });
        await this.runRules("save", {
            input: data,
            repository: this.repository,
            domain: this.domain,
            serviceName: this.name
        });

        const model = await this.repository.save(data);

        this.emit("saved", {
            input: data,
            result: model,
            repository: this.repository,
            domain: this.domain,
            serviceName: this.name
        });

        return model;
    }
    update(id: string, data: UpdateInput<T>): Promise<OperationResult> {
        throw new Error("Method not implemented.");
    }
    updateMany(params: IQueryBuilder<T>, data: UpdateInput<T>): Promise<OperationResult> {
        throw new Error('Method not implemented.');
    }
    addListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
        if (!this._eventListeners[eventName as string]) {
            this._eventListeners[eventName as string] = [];
        }
        this._eventListeners[eventName as string].push(listener);
        return this;
    }
    on(eventName: string | symbol, listener: (...args: any[]) => void): this {
        return this.addListener(eventName, listener);
    }
    once(eventName: string | symbol, listener: (...args: any[]) => void): this {
        if (!this._onceListeners[eventName as string]) {
            this._onceListeners[eventName as string] = [];
        }
        this._onceListeners[eventName as string].push(listener);
        return this;
    }
    removeListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
        if (this._eventListeners[eventName as string]) {
            const index = this._eventListeners[eventName as string].indexOf(listener);
            if (index >= 0) {
                this._eventListeners[eventName as string].splice(index, 1);
            }
        }
        if (this._onceListeners[eventName as string]) {
            const index = this._onceListeners[eventName as string].indexOf(listener);
            if (index >= 0) {
                this._onceListeners[eventName as string].splice(index, 1);
            }
        }
        return this;
    }
    off(eventName: string | symbol, listener: (...args: any[]) => void): this {
        return this.removeListener(eventName, listener);
    }
    removeAllListeners(event?: string | symbol | undefined): this {
        if (event) {
            delete this._eventListeners[event as string];
            delete this._onceListeners[event as string];
        } else {
            this._eventListeners = {};
            this._onceListeners = {};
        }
        return this;
    }
    setMaxListeners(n: number): this {
        throw new Error("Method not implemented.");
    }
    getMaxListeners(): number {
        throw new Error("Method not implemented.");
    }
    listeners(eventName: string | symbol): Function[] {
        return [
            ...(this._eventListeners[eventName as string] || []),
            ...(this._onceListeners[eventName as string] || [])
        ];
    }
    rawListeners(eventName: string | symbol): Function[] {
        return this.listeners(eventName);
    }
    emit(eventName: string | symbol, ...args: any[]): boolean {
        const listeners = this._eventListeners[eventName as string] || [];
        const onceListeners = this._onceListeners[eventName as string] || [];
        const allListeners = [...listeners, ...onceListeners];
        for (const listener of allListeners) {
            try {
                listener(...args);
            } catch (error) {
                this.emit("error", error);
            }
        }
        delete this._onceListeners[eventName as string];
        return true;
    }
    listenerCount(eventName: string | symbol): number {
        return (this._eventListeners[eventName as string] || []).length + (this._onceListeners[eventName as string] || []).length;
    }
    prependListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
        this._eventListeners[eventName as string].unshift(listener);
        return this;
    }
    prependOnceListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
        this._onceListeners[eventName as string].unshift(listener);
        return this;
    }
    eventNames(): (string | symbol)[] {
        return [
            ...Object.keys(this._eventListeners),
            ...Object.keys(this._onceListeners)
        ];
    }

    addRule(method: keyof IRepository<T>, rule: (...args: any[]) => boolean): this {
        if (!this._rules[method]) {
            this._rules[method] = [];
        }
        this._rules[method]?.push(rule);
        return this;
    }
    addRuleOnce(method: keyof IRepository<T>, rule: (...args: any[]) => boolean): this {
        if (!this._onceRules[method]) {
            this._onceRules[method] = [];
        }
        this._onceRules[method]?.push(rule);
        return this;
    }
    async runRules(method: keyof IRepository<T>, ...args: any[]): Promise<void> {
        const rules = this._rules[method];
        if (rules) {
            for (const rule of rules) {
                const result = await rule(args);
                if (result) {
                    continue;
                } else {
                    throw new Error("Rule failed" + rule.name);
                }
            }
        }

        const rulesOnces = this._onceRules[method];
        if (rulesOnces) {
            for (const rule of rulesOnces) {
                const result = rule(args);
                if (result) {
                    // delete rule
                    this._onceRules[method]?.splice(rulesOnces.indexOf(rule), 1);
                    continue;
                } else {
                    throw new Error("Rule failed" + rule.name);
                }
            }
        }
    }

    // addPreHook
    // addPostHook

    // createProxyMethods(repository: IRepository<T>) {
    //     for (const method of Object.getOwnPropertyNames(Object.getPrototypeOf(repository))) {
    //         switch (method) {
    //             case "constructor":
    //                 break;
    //             case "save":
    //                 this.createProxiesForSaveMethod(repository);
    //                 break;
    //             // case "read":
    //             //     this.createProxyMethodForRead(repository);
    //             //     break;
    //             // case "update":
    //             //     this.createProxyMethodForUpdate(repository);
    //             //     break;
    //             // case "delete":
    //             //     this.createProxyMethodForDelete(repository);
    //             //     break;
    //             // case "list":
    //             //     this.createProxyMethodForList(repository);
    //             //     break;
    //             // default:
    //             //     throw new Error(`Method ${method} not implemented in Service`);
    //         }
    //         // (this as any)[method] = () => {
    //         //     // return (repository as any)[method]();
    //         //     // get the arguments and pass them to the
    //         //     // repository method
    //         //     const args = Array.from(arguments);
    //         //     return (repository as any)[method](...args);
    //         // }
    //     }
    // }
    // createProxiesForSaveMethod(repository: IRepository<T>) {
    //     (this as any)['save'] = async (data: SaveInput<T>) => {
    //         const definition: T = await repository.save(data);

    //         return definition;
    //     }

    //     (this as any)['create'] = (this as any)['save'];

    //     (this as any)[method] = async (data: SaveInput<T>) => {
    //         const definition: T = await repository.save(data);

    //         if (method === "createInstance") {
    //             const instance: Instance<T> = {
    //                 ...definition,
    //                 update: async () => {
    //                     // instance checks ??
    //                     // instance pre hooks
    //                     // pass to model
    //                     // instance post hooks
    //                     return { ok: true, records: 1 };
    //                 },
    //                 delete: async () => {
    //                     // instance checks ??
    //                     // instance pre hooks
    //                     // pass to model
    //                     // instance post hooks
    //                     return repository.delete(definition.id);
    //                 }
    //             } as any;
    //             return instance;
    //         }

    //         return definition;
    //     }
    // }

    // createProxiesForMethods(method: string, repository: IRepository<T>) {
    //     (this as any)[method] = async (data: SaveInput<T>) => {
    //         const definition: T = await (repository as any)[method](data);

    //         return definition;
    //     }
    // }

//     async create<T extends ModelDefinition>(definition: T, params: QueryParams, meta?: QueryMeta): Promise<T> {
//     // run domain checks

//     // run pre hooks

//     // run post hooks

//     // return created instance
//     return definition;
//   }
}