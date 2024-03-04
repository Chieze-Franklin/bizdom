import { Service } from '.';
import { CharacterRepository } from '../mocks';

describe('Service', () => {
  it('can create a service from a repository', () => {
    const repository = new CharacterRepository();
    const service = new Service(repository);
    expect(service).toBeTruthy();
    expect(service.repository).toBe(repository);
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

    it('should pass data to the repository method via the hooks', async () => {
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
