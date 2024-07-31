import { IQueryOptions, IRepository } from '../repository';
import { ID, OperationResult, Persisted, SaveInput, UpdateInput } from '../types';

export interface ICharacter {
  id?: ID;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Character implements ICharacter {
  id?: ID;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: ICharacter) {
    this.id = data.id;
    this.name = data.name;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

export interface ICharacterRepository extends IRepository<ICharacter> {}

export class CharacterRepository implements ICharacterRepository {
  repo: ICharacter[] = [];

  count<T>(options?: IQueryOptions<T>): Promise<number> {
    throw new Error('Method not implemented.');
  }
  delete(id: ID): Promise<Persisted<ICharacter>> {
    throw new Error('Method not implemented.');
  }
  deleteMany(options: IQueryOptions<ICharacter>): Promise<OperationResult> {
    throw new Error('Method not implemented.');
  }
  exists<T>(options: IQueryOptions<T>): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  find<T>(id: ID, options?: IQueryOptions<T>): Promise<Persisted<ICharacter> | null> {
    throw new Error('Method not implemented.');
  }
  findAndDelete(id: ID): Promise<Persisted<ICharacter> | null> {
    throw new Error('Method not implemented.');
  }
  findAndUpdate(id: ID, data: UpdateInput<ICharacter>): Promise<Persisted<ICharacter> | null> {
    throw new Error('Method not implemented.');
  }
  get<T>(id: ID, options?: IQueryOptions<T>): Promise<Persisted<ICharacter>> {
    throw new Error('Method not implemented.');
  }
  getMany(options?: IQueryOptions<ICharacter>): Promise<Persisted<ICharacter>[]> {
    throw new Error('Method not implemented.');
  }
  save(data: SaveInput<ICharacter>): Promise<Persisted<ICharacter>> {
    const savedData = { ...data, id: '1', createdAt: new Date(), updatedAt: new Date() };
    this.repo.push(savedData);
    return Promise.resolve(savedData);
  }
  update(data: UpdateInput<ICharacter>): Promise<Persisted<ICharacter>> {
    throw new Error('Method not implemented.');
  }
  updateMany(options: IQueryOptions<ICharacter>, data: UpdateInput<ICharacter>): Promise<OperationResult> {
    throw new Error('Method not implemented.');
  }
}
