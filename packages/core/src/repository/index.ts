import {
  ComplexFilterQuery,
  FilterQuery,
  ID,
  IncludeQuery,
  OperationResult,
  Persisted,
  SaveInput,
  SelectQuery,
  SortQuery,
  UpdateInput,
} from '../types';

export interface IModelEntityMapper<T, Entity = any> {
  toModel(entity: Entity): T;
  toEntity(model: T): Entity;
}

export interface IQueryOptions<T> {
  include?: IncludeQuery<T>;
  limit?: number;
  select?: SelectQuery<T>;
  skip?: number;
  sort?: SortQuery<T>;
  where?: ComplexFilterQuery<T>;
}

// export interface IQueryBuilder<T> {
//   and(query: FilterQuery<T>): IQueryBuilder<T>; // Omit<IQueryBuilder<T>, 'where'>;
//   beginGroup(): IQueryBuilder<T>;
//   build(): any;
//   buildToJSON(): any;
//   endGroup(): IQueryBuilder<T>; // Omit<IQueryBuilder<T>, 'where'>;
//   limit(limit: number): IQueryBuilder<T>; // Omit<IQueryBuilder<T>, 'where'>;
//   or(query: FilterQuery<T>): IQueryBuilder<T>; // Omit<IQueryBuilder<T>, 'where'>;
//   skip(skip: number): IQueryBuilder<T>; // Omit<IQueryBuilder<T>, 'where'>;
//   sort(query: SortQuery<T>): IQueryBuilder<T>; // Omit<IQueryBuilder<T>, 'where'>;
//   where(query: FilterQuery<T>): IQueryBuilder<T>; // Omit<IQueryBuilder<T>, 'where'>;
// }

// export abstract class QueryBuilder<T> implements IQueryBuilder<T> {
//   abstract and(query: FilterQuery<T>): IQueryBuilder<T>; // Omit<IQueryBuilder<T>, 'where'>;
//   abstract beginGroup(): IQueryBuilder<T>;
//   abstract build(): any;
//   buildToJSON() {
//     return JSON.stringify(this.build());
//   }
//   abstract endGroup(): IQueryBuilder<T>; // Omit<IQueryBuilder<T>, 'where'>;
//   abstract limit(limit: number): IQueryBuilder<T>; // Omit<IQueryBuilder<T>, 'where'>;
//   abstract or(query: FilterQuery<T>): IQueryBuilder<T>; // Omit<IQueryBuilder<T>, 'where'>;
//   abstract skip(skip: number): IQueryBuilder<T>; // Omit<IQueryBuilder<T>, 'where'>;
//   abstract sort(query: SortQuery<T>): IQueryBuilder<T>; // Omit<IQueryBuilder<T>, 'where'>;
//   abstract where(query: FilterQuery<T>): IQueryBuilder<T>; // Omit<IQueryBuilder<T>, 'where'>;
// }

export interface IRepository<T> {
  // aggregate(options?: IQueryBuilder<T>): Promise<Persisted<T>[]>;
  count(options?: IQueryOptions<T>): Promise<number>;
  delete(id: ID): Promise<Persisted<T>>;
  deleteMany(options: IQueryOptions<T>): Promise<OperationResult>;
  // distinct(options: IQueryOptions<T>): Promise<Persisted<T>[]>;
  // drop(name: string, options: IQueryOptions<T>): Promise<number>;
  exists(options: IQueryOptions<T>): Promise<boolean>;
  find(id: ID, options?: IQueryOptions<T>): Promise<Persisted<T> | null>;
  findAndDelete(id: ID): Promise<Persisted<T> | null>;
  findAndUpdate(id: ID, data: UpdateInput<T>): Promise<Persisted<T> | null>;
  get(id: ID, options?: IQueryOptions<T>): Promise<Persisted<T>>;
  getMany(options?: IQueryOptions<T>): Promise<Persisted<T>[]>;
  // group(name: string, options?: IQueryOptions<T>): Promise<number>;
  save(data: SaveInput<T>): Promise<Persisted<T>>;
  update(data: UpdateInput<T>): Promise<Persisted<T>>;
  updateMany(options: IQueryOptions<T>, data: UpdateInput<T>): Promise<OperationResult>;
}

export class NullRepository<T> implements IRepository<T> {
  count(options?: IQueryOptions<T>): Promise<number> {
    throw new Error('Method not implemented.');
  }
  delete(id: ID): Promise<Persisted<T>> {
    throw new Error('Method not implemented.');
  }
  deleteMany(options: IQueryOptions<T>): Promise<OperationResult> {
    throw new Error('Method not implemented.');
  }
  exists(options: IQueryOptions<T>): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  find(id: ID, options?: IQueryOptions<T>): Promise<Persisted<T> | null> {
    throw new Error('Method not implemented.');
  }
  findAndDelete(id: ID): Promise<Persisted<T> | null> {
    throw new Error('Method not implemented.');
  }
  findAndUpdate(id: ID, data: UpdateInput<T>): Promise<Persisted<T> | null> {
    throw new Error('Method not implemented.');
  }
  get(id: ID, options?: IQueryOptions<T>): Promise<Persisted<T>> {
    throw new Error('Method not implemented.');
  }
  getMany(options?: IQueryOptions<T>): Promise<Persisted<T>[]> {
    throw new Error('Method not implemented.');
  }
  save(data: SaveInput<T>): Promise<Persisted<T>> {
    throw new Error('Method not implemented.');
  }
  update(data: UpdateInput<T>): Promise<Persisted<T>> {
    throw new Error('Method not implemented.');
  }
  updateMany(options: IQueryOptions<T>, data: UpdateInput<T>): Promise<OperationResult> {
    throw new Error('Method not implemented.');
  }
}
