import { Rule } from "../types";

export class RuleFailedError extends Error {
  constructor(rule: Rule) {
    super(
      `Rule ${rule.name} failed. Rule must return a value of true to pass.`,
    );
    this.name = 'RuleFailedError';
  }
}
