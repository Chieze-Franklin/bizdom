import { EventEmitter } from 'events';
import { Domain } from "../domain";
import { InstanceIdNotFoundError, RepositoryActionError, RuleFailedError } from '../errors';
import { IQueryBuilder, IRepository } from "../repository";
import {
    Instance,
    OperationResult,
    Rule,
    SaveInput,
    UpdateInput
} from "../types";

export interface IService<T> extends IRepository<T>, EventEmitter {
    create(data: SaveInput<T>): Promise<T>;
    createInstance(data: SaveInput<T>): Promise<Instance<T>>;
}

export class Service<T> implements IService<T> {
    constructor(public repository: IRepository<T>) {
        // this.createProxyMethods(repository);
    }

    private _eventListeners: Record<string, Function[]> = {};
    private _onceListeners: Record<string, Function[]> = {};

    private _preHooks: Partial<Record<keyof IRepository<T>, Function[]>> = {};
    private _postHooks: Partial<Record<keyof IRepository<T>, Function[]>> = {};

    private _rules: Partial<Record<keyof IRepository<T>, Rule[]>> = {};
    private _rulesOnce: Partial<Record<keyof IRepository<T>, Rule[]>> = {};

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

    count<T>(params?: IQueryBuilder<T>): Promise<number> {
        return this.repoAction("count", this.repository.count.bind(this.repository), params);
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
                    throw new InstanceIdNotFoundError();
                }
                return this.update(id as string, model as UpdateInput<T>);
            },
            delete: async () => {
                const id = (model as any)['id'];
                if (!id) {
                    throw new InstanceIdNotFoundError();
                }
                return this.delete(id as string);
            }
        } as any;

        return instance;
    }
    delete(id: string): Promise<OperationResult> {
        return this.repoAction("delete", this.repository.delete.bind(this.repository), id);
    }
    deleteMany(params: IQueryBuilder<T>): Promise<OperationResult> {
        return this.repoAction("deleteMany", this.repository.deleteMany.bind(this.repository), params);
    }
    async repoAction<T>(action: keyof IRepository<T>, method: Function, ...args: any[]): Promise<any> {
        let preEvent = `pre${action.toLocaleLowerCase()}`;
        let postEvent = `post${action.toLocaleLowerCase()}`;

        try {
            this.emit(preEvent, ...args);

            await this.domain?.runRules(action, ...args);
            await this.runRules(action, ...args);

            // const result = await method(...args);
            const result = await this.runPreHooks(action, method, ...args) as T;

            this.emit(postEvent, ...args);

            return result;
        }
        catch (error) {
            this.emit("error", error);
            throw new RepositoryActionError(action, error);
        }
    }

    exists<T>(params: IQueryBuilder<T>): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    get(id: string): Promise<T | null> {
        throw new Error("Method not implemented.");
    }
    getMany(params: IQueryBuilder<T>): Promise<T[]> {
        throw new Error("Method not implemented.");
    }
    save(data: SaveInput<T>): Promise<T> {
        return this.repoAction("save", this.repository.save.bind(this.repository), data);
    }
    update(id: string, data: UpdateInput<T>): Promise<OperationResult> {
        return this.repoAction("update", this.repository.update.bind(this.repository), id, data);
    }
    updateMany(params: IQueryBuilder<T>, data: UpdateInput<T>): Promise<OperationResult> {
        return this.repoAction("updateMany", this.repository.updateMany.bind(this.repository), params, data);
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

    addRule(method: keyof IRepository<T>, rule: Rule): this {
        if (!this._rules[method]) {
            this._rules[method] = [];
        }
        this._rules[method]?.push(rule);
        return this;
    }
    addRuleOnce(method: keyof IRepository<T>, rule: Rule): this {
        if (!this._rulesOnce[method]) {
            this._rulesOnce[method] = [];
        }
        this._rulesOnce[method]?.push(rule);
        return this;
    }
    async runRules(method: keyof IRepository<T>, ...args: any[]): Promise<void> {
        const rules = this._rules[method];
        if (rules) {
            for (const rule of rules) {
                const result = await rule(args);
                if (!result) {
                    throw new RuleFailedError(rule);
                }
            }
        }

        const rulesOnces = this._rulesOnce[method];
        if (rulesOnces) {
            for (const rule of rulesOnces) {
                const result = rule(args);
                if (!result) {
                    throw new RuleFailedError(rule);
                }
                this._rulesOnce[method]?.splice(rulesOnces.indexOf(rule), 1);
            }
        }
    }

    addPreHook(method: keyof IRepository<T>, hook: Function): this {
        if (!this._preHooks[method]) {
            this._preHooks[method] = [];
        }
        this._preHooks[method]?.push(hook);
        return this;
    }
    pre(method: keyof IRepository<T>, hook: Function): this {
        return this.addPreHook(method, hook);
    }
    addPostHook(method: keyof IRepository<T>, hook: Function): this {
        if (!this._postHooks[method]) {
            this._postHooks[method] = [];
        }
        this._postHooks[method]?.push(hook);
        return this;
    }
    post(method: keyof IRepository<T>, hook: Function): this {
        return this.addPostHook(method, hook);
    }

    // run preHooks
    // each hook should receive a "next" function that refers to the next hook
    async runPreHooks(method: keyof IRepository<T>, final: Function, ...args: any[]): Promise<any> {
        const hooks = this._preHooks[method];
        if (hooks && hooks.length) {
            const nexts: Function[] = [];
            for (let i = hooks.length - 1; i >= 0; i--) {
                if (i === hooks.length - 1) {
                    const next = async (...a: any[]) => {
                        const finalArgs = a && a.length ? a : args;
                        return final(...finalArgs);
                    };
                    nexts.push(next);
                } else {
                    const nextHook = hooks[i + 1];
                    const reverseIndex = hooks.length - 2 - i;
                    const nextNext = nexts[reverseIndex];
                    const next = async (...a: any[]) => {
                        const finalArgs = a && a.length ? a : args;
                        return nextHook(...finalArgs, nextNext);
                    };
                    nexts.push(next);
                }
            }
            // reverse the nexts so they match the order of the hooks
            nexts.reverse();

            // now call the first hook
            const firstHook = hooks[0];
            return firstHook(...args, nexts[0]);
        }

        return final(...args);
    }

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