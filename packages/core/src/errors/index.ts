import { IRepository } from "../repository";
import { Rule } from "../types";

export class InstanceIdNotFoundError extends Error {
  constructor() {
    super('Instance does not have an id');
    this.name = 'InstanceIdNotFoundError';
  }
}

export class RepositoryActionError extends Error {
  constructor(action: keyof IRepository<any>, error: Error | unknown) {
    super(`Error occurred while running ${action} on repository.\n\n${error}`);
    this.name = 'RepositoryActionError';
  }
}

export class RepositoryActionNotImplementedError extends Error {
  constructor(action: keyof IRepository<any>) {
    super(`Method ${action} not implemented in repository`);
    this.name = 'RepositoryActionNotImplementedError';
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
