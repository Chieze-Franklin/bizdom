import { IRepository } from "../repository";
import { Rule } from "../types";

export class InstanceIdNotFoundError extends Error {
  constructor() {
    super('Instance does not have an id');
    this.name = 'InstanceIdNotFoundError';
  }
}

export class RepositoryMethodFailedError extends Error {
  constructor(public method: keyof IRepository<any>, public error: Error | unknown) {
    super(`Error occurred while running "${method}" on repository.\n\n${error}`);
    this.name = 'RepositoryMethodFailedError';
  }
}

export class RepositoryMethodNotImplementedError extends Error {
  constructor(method: keyof IRepository<any>) {
    super(`Method "${method}" not implemented in repository`);
    this.name = 'RepositoryMethodNotImplementedError';
  }
}

export class RuleFailedError extends Error {
  constructor(rule: Rule) {
    super(
      `Rule ${rule.name} failed. Rule must return a value of true to pass.`,
    );
    this.name = 'RuleFailedError';
  }
}
