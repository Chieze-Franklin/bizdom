import { FilterQuery, OperationResult, SaveInput, SortQuery, UpdateInput } from '../types';

export interface IModelEntityMapper<T, Entity = any> {
  toModel(entity: Entity): T;
  toEntity(model: T): Entity;
}

export interface IQueryBuilder<T> {
  and(query: FilterQuery<T>): Omit<IQueryBuilder<T>, 'where'>;
  beginGroup(): IQueryBuilder<T>;
  build(): any;
  endGroup(): Omit<IQueryBuilder<T>, 'where'>;
  limit(limit: number): Omit<IQueryBuilder<T>, 'where'>;
  or(query: FilterQuery<T>): Omit<IQueryBuilder<T>, 'where'>;
  skip(skip: number): Omit<IQueryBuilder<T>, 'where'>;
  sort(query: SortQuery<T>): Omit<IQueryBuilder<T>, 'where'>;
  where(query: FilterQuery<T>): Omit<IQueryBuilder<T>, 'where'>;
}

export interface IRepository<T> {
  // aggregate(params?: IQueryBuilder<T>): Promise<T[]>;
  count(params?: IQueryBuilder<T>): Promise<number>;
  delete(id: string): Promise<OperationResult>;
  deleteMany(params: IQueryBuilder<T>): Promise<OperationResult>;
  // distinct(params: IQueryBuilder<T>): Promise<T[]>;
  // drop(name: string, params: IQueryBuilder<T>): Promise<number>;
  exists(params: IQueryBuilder<T>): Promise<boolean>;
  get(id: string): Promise<T | null>;
  getMany(params?: IQueryBuilder<T>): Promise<T[]>;
  // group(name: string, params?: IQueryBuilder<T>): Promise<number>;
  save(data: SaveInput<T>): Promise<T>;
  update(id: string, data: UpdateInput<T>): Promise<OperationResult>;
  updateMany(params: IQueryBuilder<T>, data: UpdateInput<T>): Promise<OperationResult>;
}
