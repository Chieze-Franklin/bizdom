import { IRepository } from '../repository';
import { Service } from '../service';

export class Domain {
  constructor(public name?: string) {}

  private _rules: Partial<Record<keyof IRepository<any>, Function[]>> = {};
  private _onceRules: Partial<Record<keyof IRepository<any>, Function[]>> = {};
  private _serviceMap: Record<string, Service<any>> = {};

  // addRule
  // addPreHook
  // addPostHook

  addRule(method: keyof IRepository<any>, rule: (...args: any[]) => boolean): this {
    if (!this._rules[method]) {
      this._rules[method] = [];
    }
    this._rules[method]?.push(rule);
    return this;
  }
  addRuleOnce(method: keyof IRepository<any>, rule: (...args: any[]) => boolean): this {
    if (!this._onceRules[method]) {
      this._onceRules[method] = [];
    }
    this._onceRules[method]?.push(rule);
    return this;
  }

  addService<T>(name: string, repository: IRepository<T>): void {
    const service = new Service<T>(repository);

    service.domain = this;
    service.name = name;
    this._serviceMap[name] = service;

    (this as any)[name] = service;
  }

  async runRules(method: keyof IRepository<any>, ...args: any[]): Promise<void> {
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

  $(name: string): Service<any> {
    return this._serviceMap[name];
  }
}
