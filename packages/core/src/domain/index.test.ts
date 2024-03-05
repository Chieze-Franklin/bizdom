import { Domain } from '.';
import { CharacterRepository } from '../mocks';

describe('Domain', () => {
  describe('Repository', () => {
    it('should register a repository in a domain', () => {
      const domain = new Domain();
      expect((domain as any)['$character']).toBeUndefined();
      expect(domain.$('character')).toBeUndefined();
      const service = domain.registerRepository('character', new CharacterRepository());
      expect((domain as any)['$character']).toBeDefined();
      expect(domain.$('character')).toBeDefined();
      expect(service).toBeDefined();
      expect(service.name).toBe('character');
      expect(service.repository).toBeInstanceOf(CharacterRepository);
      expect(service.domain).toBe(domain);
    });

    it('should remove a repository from a domain', () => {
      const domain = new Domain();
      domain.registerRepository('character', new CharacterRepository());
      expect((domain as any)['$character']).toBeDefined();
      expect(domain.$('character')).toBeDefined();
      domain.removeRepository('character');
      expect((domain as any)['$character']).toBeUndefined();
      expect(domain.$('character')).toBeUndefined();
    });
  });

  describe('Rules', () => {
    it('should run a passing rule multiple times', () => {
      const domain = new Domain();
      const rule = jest.fn(() => Promise.resolve(true));
      domain.addRule('save', rule);
      domain.runRules('save');
      domain.runRules('save');
      domain.runRules('save');
      expect(rule).toHaveBeenCalledTimes(3);
    });

    it('should pass arguments to rules', () => {
      const domain = new Domain();
      const rule = jest.fn(() => Promise.resolve(true));
      domain.addRule('save', rule);
      domain.runRules('save', 'arg1', 'arg2', 'arg3');
      expect(rule).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');
    });

    it('should not throw an error even if no rule is provided', () => {
      const domain = new Domain();
      expect(domain.runRules('save')).resolves.not.toThrow();
    });

    it('should throw an error if a rule fails', () => {
      const domain = new Domain();
      const rule = jest.fn(() => Promise.resolve(false));
      domain.addRule('save', rule);
      expect(domain.runRules('save')).rejects.toThrow();
    });

    it('should run multiple rules', async () => {
      const domain = new Domain();
      const rule1 = jest.fn(() => Promise.resolve(true));
      const rule2 = jest.fn(() => Promise.resolve(true));
      domain.addRule('save', rule1);
      domain.addRule('save', rule2);
      await domain.runRules('save');
      await domain.runRules('save');
      await domain.runRules('save');
      expect(rule1).toHaveBeenCalledTimes(3);
      expect(rule2).toHaveBeenCalledTimes(3);
    });

    it('should not run following rules if a rule fails', () => {
      const domain = new Domain();
      const rule1 = jest.fn(() => Promise.resolve(false));
      const rule2 = jest.fn(() => Promise.resolve(true));
      domain.addRule('save', rule1);
      domain.addRule('save', rule2);
      expect(domain.runRules('save')).rejects.toThrow();
      expect(rule1).toHaveBeenCalled();
      expect(rule2).not.toHaveBeenCalled();
    });

    it('should run a rule once', async () => {
      const domain = new Domain();
      const rule = jest.fn(() => Promise.resolve(true));
      domain.addRuleOnce('save', rule);
      await domain.runRules('save');
      await domain.runRules('save');
      await domain.runRules('save');
      expect(rule).toHaveBeenCalledTimes(1);
    });

    it('should run multiple rules once', async () => {
      const domain = new Domain();
      const rule1 = jest.fn(() => Promise.resolve(true));
      const rule2 = jest.fn(() => Promise.resolve(true));
      domain.addRuleOnce('save', rule1);
      domain.addRuleOnce('save', rule2);
      await domain.runRules('save');
      await domain.runRules('save');
      await domain.runRules('save');
      expect(rule1).toHaveBeenCalledTimes(1);
      expect(rule2).toHaveBeenCalledTimes(1);
    });

    it('should remove a rule', async () => {
      const domain = new Domain();
      const rule = jest.fn(() => Promise.resolve(true));
      domain.addRule('save', rule);
      domain.removeRule('save', rule);
      await domain.runRules('save');
      expect(rule).not.toHaveBeenCalled();
    });

    it('should remove a rule [take 2]', async () => {
      const domain = new Domain();
      const rule1 = jest.fn(() => Promise.resolve(true));
      const rule2 = jest.fn(() => Promise.resolve(true));
      domain.addRule('save', rule1);
      domain.addRule('save', rule2);
      domain.removeRule('save', rule1);
      await domain.runRules('save');
      expect(rule1).not.toHaveBeenCalled();
      expect(rule2).toHaveBeenCalled();
    });

    it('should remove a rule [take 3]', async () => {
      const domain = new Domain();
      const rule1 = jest.fn(() => Promise.resolve(true));
      const rule2 = jest.fn(() => Promise.resolve(true));
      const rule3 = jest.fn(() => Promise.resolve(true));
      const rule4 = jest.fn(() => Promise.resolve(true));
      domain.addRule('save', rule1);
      domain.addRule('save', rule2);
      domain.addRuleOnce('save', rule3);
      domain.addRuleOnce('save', rule4);
      domain.removeRule('save', rule1);
      domain.removeRule('save', rule3);
      await domain.runRules('save');
      expect(rule1).not.toHaveBeenCalled();
      expect(rule2).toHaveBeenCalled();
      expect(rule3).not.toHaveBeenCalled();
      expect(rule4).toHaveBeenCalled();
    });
  });
});
