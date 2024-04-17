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

  createService<T>(name: string | (new (...args: any[]) => T), repository?: IRepository<T>): Service<T> {
    if (!repository) {
      repository = new NullRepository<T>();
    }
    const service = new Service<T>(repository);

    const resolvedName = this.resolveName(name);

    service.domain = this;
    service.name = resolvedName;

    this._serviceMap[resolvedName] = service;
    (this as any)[`$${resolvedName}`] = service;

    return service;
  }

  deleteService<T>(name: string | (new (...args: any[]) => T)): void {
    const resolvedName = this.resolveName(name);
    delete this._serviceMap[resolvedName];
    delete (this as any)[`$${resolvedName}`];
  }

  private resolveName<T>(name: string | (new (...args: any[]) => T)): string {
    if (typeof name === 'string') {
      return name;
    } else {
      return name.name;
    }
  }

  registerRepository<T>(name: string | (new (...args: any[]) => T), repository: IRepository<T>): Service<T> {
    const resolvedName = this.resolveName(name);
    if (!this._serviceMap[resolvedName]) {
      return this.createService(resolvedName, repository);
    } else {
      this._serviceMap[resolvedName].repository = repository;
      return this._serviceMap[resolvedName];
    }
  }

  removeRepository<T>(name: string | (new (...args: any[]) => T)): void {
    const resolvedName = this.resolveName(name);
    this._serviceMap[resolvedName].repository = new NullRepository();
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

  $<T>(name: string | (new (...args: any[]) => T)): Service<T> {
    const resolvedName = this.resolveName(name);
    return this._serviceMap[resolvedName];
  }
}
