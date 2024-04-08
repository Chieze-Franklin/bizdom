import { Domain } from '.';
import { CharacterRepository } from '../mocks';
import { NullRepository } from '../repository';

describe('Domain', () => {
  describe('Repository', () => {
    it('should create a service without a repository in a domain', () => {
      const domain = new Domain();
      expect((domain as any)['$character']).toBeUndefined();
      expect(domain.$('character')).toBeUndefined();
      domain.createService('character');
      expect((domain as any)['$character']).toBeDefined();
      expect(domain.$('character')).toBeDefined();
      expect(domain.$('character').repository).toBeInstanceOf(NullRepository);
    });

    it('should remove a service from a domain', () => {
      const domain = new Domain();
      domain.createService('character');
      expect((domain as any)['$character']).toBeDefined();
      expect(domain.$('character')).toBeDefined();
      domain.deleteService('character');
      expect((domain as any)['$character']).toBeUndefined();
      expect(domain.$('character')).toBeUndefined();
    });

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
      const repository = new CharacterRepository();
      domain.registerRepository('character', repository);
      expect((domain as any)['$character']).toBeDefined();
      expect(domain.$('character')).toBeDefined();
      expect(domain.$('character').repository).toBe(repository);
      domain.removeRepository('character');
      expect((domain as any)['$character']).toBeDefined();
      expect(domain.$('character')).toBeDefined();
      expect(domain.$('character').repository).not.toBe(repository);
      expect(domain.$('character').repository).toBeInstanceOf(NullRepository);
    });
  });

  describe('Rules', () => {
    it('should run a rule', () => {
      const domain = new Domain();
      const rule = jest.fn(() => Promise.resolve(true));
      domain.addRule('save', rule);
      domain.runRules('save');
      expect(rule).toHaveBeenCalled();
    });

    it('should run rules attached to both domain and service', async () => {
      const domain = new Domain();
      const rule1 = jest.fn(() => Promise.resolve(true));
      domain.addRule('save', rule1);
      const repository = new CharacterRepository();
      domain.registerRepository('character', repository);
      const rule2 = jest.fn(() => Promise.resolve(true));
      domain.$('character').addRule('save', rule2);
      await domain.$('character').save({ name: 'test' });
      expect(rule1).toHaveBeenCalled();
      expect(rule2).toHaveBeenCalled();
    });

    it('should run a rule multiple times', () => {
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

    it('should throw an error with default message if a rule returns an empty string', async () => {
      const domain = new Domain();
      const rule = jest.fn(() => Promise.resolve(''));
      domain.addRule('save', rule);
      try {
        await domain.runRules('save');
      } catch (error) {
        expect((error as unknown as Error).message).toBe(
          `Rule ${rule.name} failed. Rule must return a value of true to pass.`,
        );
      }
    });

    it('should throw an error with custom message if a rule returns a non-empty string', async () => {
      const domain = new Domain();
      const rule = jest.fn(() => Promise.resolve('Custom error message'));
      domain.addRule('save', rule);
      try {
        await domain.runRules('save');
      } catch (error) {
        expect((error as unknown as Error).message).toBe('Custom error message');
      }
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
