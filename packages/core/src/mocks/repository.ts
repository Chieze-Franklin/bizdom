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
    delete(id: string): Promise<OperationResult> {
        throw new Error('Method not implemented.');
    }
    deleteMany(params: IQueryBuilder<ICharacter>): Promise<OperationResult> {
        throw new Error('Method not implemented.');
    }
    get(id: string): Promise<ICharacter | null> {
        throw new Error('Method not implemented.');
    }
    getMany(params: IQueryBuilder<ICharacter>): Promise<ICharacter[]> {
        throw new Error('Method not implemented.');
    }
    save(data: SaveInput<ICharacter>): Promise<ICharacter> {
        throw new Error('Method not implemented.');
    }
    update(id: string, data: UpdateInput<ICharacter>): Promise<OperationResult> {
        throw new Error('Method not implemented.');
    }
    updateMany(params: IQueryBuilder<ICharacter>, data: UpdateInput<ICharacter>): Promise<OperationResult> {
        throw new Error('Method not implemented.');
    }
}
