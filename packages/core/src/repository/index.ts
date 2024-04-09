import { FilterQuery, ID, OperationResult, Persisted, SaveInput, SortQuery, UpdateInput } from '../types';

export interface IModelEntityMapper<T, Entity = any> {
  toModel(entity: Entity): T;
  toEntity(model: T): Entity;
}

export interface IQueryBuilder<T> {
  and(query: FilterQuery<T>): IQueryBuilder<T>; // Omit<IQueryBuilder<T>, 'where'>;
  beginGroup(): IQueryBuilder<T>;
  build(): any;
  buildToJSON(): any;
  endGroup(): IQueryBuilder<T>; // Omit<IQueryBuilder<T>, 'where'>;
  limit(limit: number): IQueryBuilder<T>; // Omit<IQueryBuilder<T>, 'where'>;
  or(query: FilterQuery<T>): IQueryBuilder<T>; // Omit<IQueryBuilder<T>, 'where'>;
  skip(skip: number): IQueryBuilder<T>; // Omit<IQueryBuilder<T>, 'where'>;
  sort(query: SortQuery<T>): IQueryBuilder<T>; // Omit<IQueryBuilder<T>, 'where'>;
  where(query: FilterQuery<T>): IQueryBuilder<T>; // Omit<IQueryBuilder<T>, 'where'>;
}

export abstract class QueryBuilder<T> implements IQueryBuilder<T> {
  abstract and(query: FilterQuery<T>): IQueryBuilder<T>; // Omit<IQueryBuilder<T>, 'where'>;
  abstract beginGroup(): IQueryBuilder<T>;
  abstract build(): any;
  buildToJSON() {
    return JSON.stringify(this.build());
  }
  abstract endGroup(): IQueryBuilder<T>; // Omit<IQueryBuilder<T>, 'where'>;
  abstract limit(limit: number): IQueryBuilder<T>; // Omit<IQueryBuilder<T>, 'where'>;
  abstract or(query: FilterQuery<T>): IQueryBuilder<T>; // Omit<IQueryBuilder<T>, 'where'>;
  abstract skip(skip: number): IQueryBuilder<T>; // Omit<IQueryBuilder<T>, 'where'>;
  abstract sort(query: SortQuery<T>): IQueryBuilder<T>; // Omit<IQueryBuilder<T>, 'where'>;
  abstract where(query: FilterQuery<T>): IQueryBuilder<T>; // Omit<IQueryBuilder<T>, 'where'>;
}

export interface IRepository<T> {
  // aggregate(params?: IQueryBuilder<T>): Promise<Persisted<T>[]>;
  count(params?: IQueryBuilder<T>): Promise<number>;
  delete(id: ID): Promise<OperationResult>;
  deleteMany(params: IQueryBuilder<T>): Promise<OperationResult>;
  // distinct(params: IQueryBuilder<T>): Promise<Persisted<T>[]>;
  // drop(name: string, params: IQueryBuilder<T>): Promise<number>;
  exists(params: IQueryBuilder<T>): Promise<boolean>;
  get(id: ID): Promise<Persisted<T> | null>;
  getMany(params?: IQueryBuilder<T>): Promise<Persisted<T>[]>;
  // group(name: string, params?: IQueryBuilder<T>): Promise<number>;
  save(data: SaveInput<T>): Promise<Persisted<T>>;
  update(id: ID, data: UpdateInput<T>): Promise<OperationResult>;
  updateMany(params: IQueryBuilder<T>, data: UpdateInput<T>): Promise<OperationResult>;
}

export class NullRepository<T> implements IRepository<T> {
  count(params?: IQueryBuilder<T>): Promise<number> {
    throw new Error('Method not implemented.');
  }
  delete(id: ID): Promise<OperationResult> {
    throw new Error('Method not implemented.');
  }
  deleteMany(params: IQueryBuilder<T>): Promise<OperationResult> {
    throw new Error('Method not implemented.');
  }
  exists(params: IQueryBuilder<T>): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  get(id: ID): Promise<Persisted<T> | null> {
    throw new Error('Method not implemented.');
  }
  getMany(params?: IQueryBuilder<T>): Promise<Persisted<T>[]> {
    throw new Error('Method not implemented.');
  }
  save(data: SaveInput<T>): Promise<Persisted<T>> {
    throw new Error('Method not implemented.');
  }
  update(id: ID, data: UpdateInput<T>): Promise<OperationResult> {
    throw new Error('Method not implemented.');
  }
  updateMany(params: IQueryBuilder<T>, data: UpdateInput<T>): Promise<OperationResult> {
    throw new Error('Method not implemented.');
  }
}
