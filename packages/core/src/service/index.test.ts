import { Service } from '.';
import { CharacterRepository } from '../mocks';

describe('Service', () => {
  it('can create a service from a repository', () => {
    const repository = new CharacterRepository();
    const service = new Service(repository);
    expect(service).toBeDefined();
    expect(service.repository).toBe(repository);
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
