import { Service } from '.';
import { IQueryBuilder, IRepository } from '../repository';
import { ID, OperationResult, SaveInput, UpdateInput } from '../types';

class Character {
  id?: ID;
  name: string = "kk";
  createdAt?: Date;
  updatedAt?: Date;
}

class CharacterRepository implements IRepository<Character> {
    delete(id: string): Promise<OperationResult> {
        throw new Error('Method not implemented.');
    }
    deleteMany(params: IQueryBuilder<Character>): Promise<OperationResult> {
        throw new Error('Method not implemented.');
    }
    get(id: string): Promise<Character | null> {
        throw new Error('Method not implemented.');
    }
    getMany(params: IQueryBuilder<Character>): Promise<Character[]> {
        throw new Error('Method not implemented.');
    }
    save(data: SaveInput<Character>): Promise<Character> {
        // write the code to save
        throw new Error('Method not implemented.');
    }
    update(id: string, data: UpdateInput<Character>): Promise<OperationResult> {
        throw new Error('Method not implemented.');
    }
    updateMany(params: IQueryBuilder<Character>, data: UpdateInput<Character>): Promise<OperationResult> {
        throw new Error('Method not implemented.');
    }
}

describe('Service', () => {
  it('can create a service from a repository', () => {
    const repository = new CharacterRepository();
    const service = new Service(repository);
    expect(service).toBeTruthy();
    expect(service.repository).toBe(repository);
  });
});
