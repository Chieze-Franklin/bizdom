import { RuleFailedError } from '../errors';
import { IRepository, NullRepository } from '../repository';
import { Service } from '../service';
import { Rule } from '../types';

export class Domain {
  constructor(public name?: string) {}

  private _rules: Partial<Record<keyof IRepository<any>, Rule[]>> = {};
  private _rulesOnce: Partial<Record<keyof IRepository<any>, Rule[]>> = {};
  private _serviceMap: Record<string, Service<any>> = {};

  addRule(method: keyof IRepository<any>, rule: Rule): this {
    if (!this._rules[method]) {
      this._rules[method] = [];
    }
    this._rules[method]?.push(rule);
    return this;
  }
  addRuleOnce(method: keyof IRepository<any>, rule: Rule): this {
    if (!this._rulesOnce[method]) {
      this._rulesOnce[method] = [];
    }
    this._rulesOnce[method]?.push(rule);
    return this;
  }

  createService<T>(name: string, repository?: IRepository<T>): Service<T> {
    if (!repository) {
      repository = new NullRepository<T>();
    }
    const service = new Service<T>(repository);

    service.domain = this;
    service.name = name;

    this._serviceMap[name] = service;
    (this as any)[`$${name}`] = service;

    return service;
  }

  deleteService(name: string): void {
    delete this._serviceMap[name];
    delete (this as any)[`$${name}`];
  }

  registerRepository<T>(name: string, repository: IRepository<T>): Service<T> {
    if (!this._serviceMap[name]) {
      return this.createService(name, repository);
    } else {
      this._serviceMap[name].repository = repository;
      return this._serviceMap[name];
    }
  }

  removeRepository(name: string): void {
    this._serviceMap[name].repository = new NullRepository();
  }

  removeRule(method: keyof IRepository<any>, rule: Rule): void {
    if (this._rules[method]) {
      const index = this._rules[method]?.indexOf(rule) ?? -1;
      if (index >= 0) {
        this._rules[method]?.splice(index, 1);
      }
    }
    if (this._rulesOnce[method]) {
      const index = this._rulesOnce[method]?.indexOf(rule) ?? -1;
      if (index >= 0) {
        this._rulesOnce[method]?.splice(index, 1);
      }
    }
  }

  async runRules(method: keyof IRepository<any>, ...args: any[]): Promise<void> {
    const rules = this._rules[method];
    if (rules) {
      for (const rule of rules) {
        const result = await rule(...args);
        if (typeof result === 'string') {
          throw new RuleFailedError(rule, result);
        }
        if (typeof result === 'boolean' && result === false) {
          throw new RuleFailedError(rule);
        }
      }
    }

    const rulesOnces = this._rulesOnce[method];
    if (rulesOnces) {
      for (const rule of rulesOnces) {
        const result = await rule(...args);
        if (typeof result === 'string') {
          throw new RuleFailedError(rule, result);
        }
        if (typeof result === 'boolean' && result === false) {
          throw new RuleFailedError(rule);
        }
        this._rulesOnce[method]?.splice(rulesOnces.indexOf(rule), 1);
      }
    }
  }

  $<T>(name: string): Service<T> {
    return this._serviceMap[name];
  }
}
