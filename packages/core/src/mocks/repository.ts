import { IQueryBuilder, IRepository } from '../repository';
import { ID, OperationResult, SaveInput, UpdateInput } from '../types';

interface ICharacter {
  id?: ID;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ICharacterRepository extends IRepository<ICharacter> {}

export class CharacterRepository implements ICharacterRepository {
  repo: ICharacter[] = [];

  count<T>(params?: IQueryBuilder<T>): Promise<number> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<OperationResult> {
    throw new Error('Method not implemented.');
  }
  deleteMany(params: IQueryBuilder<ICharacter>): Promise<OperationResult> {
    throw new Error('Method not implemented.');
  }
  exists<T>(params: IQueryBuilder<T>): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  get(id: string): Promise<ICharacter | null> {
    throw new Error('Method not implemented.');
  }
  getMany(params?: IQueryBuilder<ICharacter>): Promise<ICharacter[]> {
    throw new Error('Method not implemented.');
  }
  save(data: SaveInput<ICharacter>): Promise<ICharacter> {
    const savedData = { ...data, id: '1', createdAt: new Date(), updatedAt: new Date() };
    this.repo.push(savedData);
    return Promise.resolve(savedData);
  }
  update(id: string, data: UpdateInput<ICharacter>): Promise<OperationResult> {
    throw new Error('Method not implemented.');
  }
  updateMany(params: IQueryBuilder<ICharacter>, data: UpdateInput<ICharacter>): Promise<OperationResult> {
    throw new Error('Method not implemented.');
  }
}
