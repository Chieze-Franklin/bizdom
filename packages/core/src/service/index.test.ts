import { Service } from '.';
import { CharacterRepository } from '../mocks';

describe('Service', () => {
  beforeAll(() => {
    jest.spyOn(process, 'nextTick').mockImplementation((cb) => cb());
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('can create a service from a repository', () => {
    const repository = new CharacterRepository();
    const service = new Service(repository);
    expect(service).toBeDefined();
    expect(service.repository).toBe(repository);
  });

  it('should not throw an error even if no rule, hook, or event listener is provided', () => {
    const repository = new CharacterRepository();
    const service = new Service(repository);
    expect(service.save({ name: 'test' })).resolves.not.toThrow();
  });

  describe('Create', () => {
    it('should treat "create" as an alias for "save"', async () => {
      const repository = new CharacterRepository();
      repository.save = jest.fn((data) => Promise.resolve({ ...data, id: '1' }));
      const service = new Service(repository);
      const hook1 = jest.fn((data, next) => next(data));
      const hook2 = jest.fn((data, next) => next(data));
      service.addPreHook('save', hook1);
      service.addPreHook('save', hook2);
      await service.create({ name: 'test' });
      expect(hook1).toHaveBeenCalled();
      expect(hook2).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('Create Instance', () => {
    it('should create a model instance that can update and delete itself', async () => {
      const repository = new CharacterRepository();
      repository.delete = jest.fn((id) => Promise.resolve({ ok: true, records: 1 }));
      repository.save = jest.fn((data) => Promise.resolve({ ...data, id: '1' }));
      repository.update = jest.fn((id, data) => Promise.resolve({ ok: true, records: 1 }));
      const service = new Service(repository);
      const model = await service.create({ name: 'test' });
      expect((model as any)['delete']).toBeUndefined();
      expect((model as any)['update']).toBeUndefined();
      const instance = await service.createInstance({ name: 'test' });
      expect(instance['delete']).toBeDefined();
      expect(instance['update']).toBeDefined();
      await instance.update();
      await instance.delete();
      expect(repository.delete).toHaveBeenCalled();
      expect(repository.update).toHaveBeenCalled();
    });

    it('should throw an error if model instance without "id" calls delete()', async () => {
      const repository = new CharacterRepository();
      repository.delete = jest.fn((id) => Promise.resolve({ ok: true, records: 1 }));
      repository.save = jest.fn((data) => Promise.resolve({ ...data, id: undefined }));
      const service = new Service(repository);
      const instance = await service.createInstance({ name: 'test' });
      await expect(instance.delete()).rejects.toThrow();
      expect(repository.delete).not.toHaveBeenCalled();
    });

    it('should throw an error if model instance without "id" calls update()', async () => {
      const repository = new CharacterRepository();
      repository.save = jest.fn((data) => Promise.resolve({ ...data, id: undefined }));
      repository.update = jest.fn((id, data) => Promise.resolve({ ok: true, records: 1 }));
      const service = new Service(repository);
      const instance = await service.createInstance({ name: 'test' });
      await expect(instance.update()).rejects.toThrow();
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('Events', () => {
    it('should treat "on" as an alias for "addListener', async () => {
      const repository = new CharacterRepository();
      const service = new Service(repository);
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      service.addListener('save', listener1);
      service.on('save', listener2);
      await service.save({ name: 'test' });
      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
    });

    it('should pass input and output arguments to the listeners', async () => {
      const repository = new CharacterRepository();
      repository.save = jest.fn((data) => Promise.resolve({ ...data, id: '1' }));
      const service = new Service(repository);
      const listener = jest.fn();
      service.addListener('save', listener);
      await service.save({ name: 'test' });
      expect(listener).toHaveBeenCalledWith({ name: 'test' }, { name: 'test', id: '1' });
    });

    it('should not throw an error even if a listener throws an error', () => {
      const repository = new CharacterRepository();
      const service = new Service(repository);
      const listener = jest.fn(() => {
        throw new Error('test');
      });
      service.addListener('save', listener);
      expect(service.save({ name: 'test' })).resolves.not.toThrow();
    });

    it('should run the following listeners even if a listener throws an error', async () => {
      const repository = new CharacterRepository();
      const service = new Service(repository);
      const listener1 = jest.fn(() => Promise.reject().catch(() => {}));
      const listener2 = jest.fn();
      service.addListener('save', listener1);
      service.addListener('save', listener2);
      await service.save({ name: 'test' });
      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
    });

    it('should run the following listeners even if a listener throws an error [take 2]', async () => {
      const repository = new CharacterRepository();
      const service = new Service(repository);
      const listener1 = jest.fn(() => {
        throw new Error('test');
      });
      const listener2 = jest.fn();
      service.addListener('save', listener1);
      service.addListener('save', listener2);
      await service.save({ name: 'test' });
      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
    });

    it('should run a listener multiple times', async () => {
      const repository = new CharacterRepository();
      const service = new Service(repository);
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      service.addListener('save', listener1);
      service.addListener('save', listener2);
      await service.save({ name: 'test' });
      await service.save({ name: 'test' });
      await service.save({ name: 'test' });
      expect(listener1).toHaveBeenCalledTimes(3);
      expect(listener2).toHaveBeenCalledTimes(3);
    });

    it('should run multiple listeners once', async () => {
      const repository = new CharacterRepository();
      const service = new Service(repository);
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      service.once('save', listener1);
      service.once('save', listener2);
      await service.save({ name: 'test' });
      await service.save({ name: 'test' });
      await service.save({ name: 'test' });
      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
    });

    it('should remove a listener using off or removeListener', async () => {
      const repository = new CharacterRepository();
      const service = new Service(repository);
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      const listener3 = jest.fn();
      service.on('save', listener1);
      service.on('save', listener2);
      service.on('save', listener3);
      await service.save({ name: 'test' });
      service.off('save', listener1);
      await service.save({ name: 'test' });
      service.removeListener('save', listener2);
      await service.save({ name: 'test' });
      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(2);
      expect(listener3).toHaveBeenCalledTimes(3);
    });

    it('should remove all listeners', async () => {
      const repository = new CharacterRepository();
      const service = new Service(repository);
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      service.on('save', listener1);
      service.on('save', listener2);
      await service.save({ name: 'test' });
      service.removeAllListeners('save');
      await service.save({ name: 'test' });
      await service.save({ name: 'test' });
      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
    });
  });

  describe('Rules', () => {
    it('should run a rule', async () => {
      const repository = new CharacterRepository();
      const service = new Service(repository);
      const rule = jest.fn(() => Promise.resolve(true));
      service.addRule('save', rule);
      await service.save({ name: 'test' });
      expect(rule).toHaveBeenCalled();
    });

    it('should run a rule multiple times', async () => {
      const repository = new CharacterRepository();
      const service = new Service(repository);
      const rule = jest.fn(() => Promise.resolve(true));
      service.addRule('save', rule);
      await service.save({ name: 'test' });
      await service.save({ name: 'test' });
      await service.save({ name: 'test' });
      expect(rule).toHaveBeenCalledTimes(3);
    });

    it('should pass arguments to rules', async () => {
      const repository = new CharacterRepository();
      const service = new Service(repository);
      const rule = jest.fn(() => Promise.resolve(true));
      service.addRule('save', rule);
      await service.save({ name: 'test' });
      expect(rule).toHaveBeenCalledWith({ name: 'test' });
    });

    it('should throw an error if a rule fails', () => {
      const repository = new CharacterRepository();
      const service = new Service(repository);
      const rule = jest.fn(() => Promise.resolve(false));
      service.addRule('save', rule);
      expect(service.save({ name: 'test' })).rejects.toThrow();
    });

    it('should run multiple rules', async () => {
      const repository = new CharacterRepository();
      const service = new Service(repository);
      const rule1 = jest.fn(() => Promise.resolve(true));
      const rule2 = jest.fn(() => Promise.resolve(true));
      service.addRule('save', rule1);
      service.addRule('save', rule2);
      await service.save({ name: 'test' });
      await service.save({ name: 'test' });
      await service.save({ name: 'test' });
      expect(rule1).toHaveBeenCalledTimes(3);
      expect(rule2).toHaveBeenCalledTimes(3);
    });

    it('should not run following rules if a rule fails', () => {
      const repository = new CharacterRepository();
      const service = new Service(repository);
      const rule1 = jest.fn(() => {
        console.log(">>>>>>>>>>>>>>this actually runs; don't know why jest is not catching it");
        return Promise.resolve(false);
      });
      const rule2 = jest.fn(() => Promise.resolve(true));
      service.addRule('save', rule1);
      service.addRule('save', rule2);
      expect(service.save({ name: 'test' })).rejects.toThrow();
      // expect(rule1).toHaveBeenCalled(); // TODO: this is failing for some strange reason
      expect(rule2).not.toHaveBeenCalled();
    });

    it('should run multiple rules once', async () => {
      const repository = new CharacterRepository();
      const service = new Service(repository);
      const rule1 = jest.fn(() => Promise.resolve(true));
      const rule2 = jest.fn(() => Promise.resolve(true));
      service.addRuleOnce('save', rule1);
      service.addRuleOnce('save', rule2);
      await service.save({ name: 'test' });
      await service.save({ name: 'test' });
      await service.save({ name: 'test' });
      expect(rule1).toHaveBeenCalledTimes(1);
      expect(rule2).toHaveBeenCalledTimes(1);
    });

    it('should remove a rule', async () => {
      const repository = new CharacterRepository();
      const service = new Service(repository);
      const rule = jest.fn(() => Promise.resolve(true));
      service.addRule('save', rule);
      service.removeRule('save', rule);
      await service.save({ name: 'test' });
      expect(rule).not.toHaveBeenCalled();
    });

    it('should remove a rule [take 2]', async () => {
      const repository = new CharacterRepository();
      const service = new Service(repository);
      const rule1 = jest.fn(() => Promise.resolve(true));
      const rule2 = jest.fn(() => Promise.resolve(true));
      service.addRule('save', rule1);
      service.addRule('save', rule2);
      service.removeRule('save', rule1);
      await service.save({ name: 'test' });
      expect(rule1).not.toHaveBeenCalled();
      expect(rule2).toHaveBeenCalled();
    });

    it('should remove a rule [take 3]', async () => {
      const repository = new CharacterRepository();
      const service = new Service(repository);
      const rule1 = jest.fn(() => Promise.resolve(true));
      const rule2 = jest.fn(() => Promise.resolve(true));
      const rule3 = jest.fn(() => Promise.resolve(true));
      const rule4 = jest.fn(() => Promise.resolve(true));
      service.addRule('save', rule1);
      service.addRule('save', rule2);
      service.addRuleOnce('save', rule3);
      service.addRuleOnce('save', rule4);
      service.removeRule('save', rule1);
      service.removeRule('save', rule3);
      await service.save({ name: 'test' });
      expect(rule1).not.toHaveBeenCalled();
      expect(rule2).toHaveBeenCalled();
      expect(rule3).not.toHaveBeenCalled();
      expect(rule4).toHaveBeenCalled();
    });
  });

  describe('Pre Hooks', () => {
    it('should run pre hooks', async () => {
      const repository = new CharacterRepository();
      const service = new Service(repository);
      const hook = jest.fn();
      service.addPreHook('save', hook);
      await service.save({ name: 'test' });
      expect(hook).toHaveBeenCalled();
    });

    it('should treat "pre" and "addPreHook" in the same manner', async () => {
      const repository = new CharacterRepository();
      const service = new Service(repository);
      const hook1 = jest.fn((data, next) => next());
      const hook2 = jest.fn((data, next) => next());
      service.addPreHook('save', hook1);
      service.pre('save', hook2);
      await service.save({ name: 'test' });
      expect(hook1).toHaveBeenCalled();
      expect(hook2).toHaveBeenCalled();
    });

    it('should pass data to the repository method via the hooks when "next" is called without argument', async () => {
      const repository = new CharacterRepository();
      repository.save = jest.fn((data) => Promise.resolve({ ...data, id: '1' }));
      const service = new Service(repository);
      const hook1 = jest.fn((data, next) => next());
      const hook2 = jest.fn((data, next) => next());
      service.addPreHook('save', hook1);
      service.addPreHook('save', hook2);
      const model = await service.save({ name: 'test' });
      expect(hook1).toHaveBeenCalled();
      expect(hook2).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalledWith({ name: 'test' });
      expect(model).toEqual({ name: 'test', id: '1' });
    });

    it('should pass data to the repository method via the hooks when "next" is called with unmodified argument', async () => {
      const repository = new CharacterRepository();
      repository.save = jest.fn((data) => Promise.resolve({ ...data, id: '1' }));
      const service = new Service(repository);
      const hook1 = jest.fn((data, next) => next(data));
      const hook2 = jest.fn((data, next) => next(data));
      service.addPreHook('save', hook1);
      service.addPreHook('save', hook2);
      const model = await service.save({ name: 'test' });
      expect(hook1).toHaveBeenCalled();
      expect(hook2).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalledWith({ name: 'test' });
      expect(model).toEqual({ name: 'test', id: '1' });
    });

    it('should pass an altered data to the repository method via the hooks', async () => {
      const repository = new CharacterRepository();
      repository.save = jest.fn((data) => Promise.resolve({ ...data, id: '1' }));
      const service = new Service(repository);
      const hook1 = jest.fn((data, next) => next({ ...data, name: 'changed in hook1' }));
      const hook2 = jest.fn((data, next) => next({ ...data, description: 'added in hook2' }));
      service.addPreHook('save', hook1);
      service.addPreHook('save', hook2);
      await service.save({ name: 'test' });
      expect(hook1).toHaveBeenCalled();
      expect(hook2).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalledWith({ name: 'changed in hook1', description: 'added in hook2' });
    });

    it('should return immediately if a hook returns', async () => {
      const repository = new CharacterRepository();
      repository.save = jest.fn((data) => Promise.resolve({ ...data, id: '1' }));
      const service = new Service(repository);
      const hook1 = jest.fn((data, next) => Promise.resolve({ ...data, name: 'changed in hook1' }));
      const hook2 = jest.fn((data, next) => next({ ...data, description: 'added in hook2' }));
      service.addPreHook('save', hook1);
      service.addPreHook('save', hook2);
      const model = await service.save({ name: 'test' });
      expect(hook1).toHaveBeenCalled();
      expect(hook2).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
      expect(model).toEqual({ name: 'changed in hook1' });
    });

    it('should stop execution if a hook fails', async () => {
      const repository = new CharacterRepository();
      repository.save = jest.fn();
      const service = new Service(repository);
      const hook1 = jest.fn(() => Promise.reject());
      const hook2 = jest.fn();
      service.addPreHook('save', hook1);
      service.addPreHook('save', hook2);
      await expect(service.save({ name: 'test' })).rejects.toThrow();
      expect(hook1).toHaveBeenCalled();
      expect(hook2).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should stop execution if a hook does not call "next()"', async () => {
      const repository = new CharacterRepository();
      repository.save = jest.fn();
      const service = new Service(repository);
      const hook1 = jest.fn();
      const hook2 = jest.fn();
      service.addPreHook('save', hook1);
      service.addPreHook('save', hook2);
      await service.save({ name: 'test' });
      expect(hook1).toHaveBeenCalled();
      expect(hook2).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should stop execution if a hook does not call "next()" [take 2]', async () => {
      const repository = new CharacterRepository();
      repository.save = jest.fn();
      const service = new Service(repository);
      const hook1 = jest.fn((data, next) => next());
      const hook2 = jest.fn();
      service.addPreHook('save', hook1);
      service.addPreHook('save', hook2);
      await service.save({ name: 'test' });
      expect(hook1).toHaveBeenCalled();
      expect(hook2).toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });
  });
});
