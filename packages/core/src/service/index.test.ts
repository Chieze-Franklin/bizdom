import { Service } from '.';
import { CharacterRepository } from '../mocks';

describe('Service', () => {
  it('can create a service from a repository', () => {
    const repository = new CharacterRepository();
    const service = new Service(repository);
    expect(service).toBeTruthy();
    expect(service.repository).toBe(repository);
  });
});
