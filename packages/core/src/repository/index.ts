import {
    SaveInput,
    FilterQuery,
    OperationResult,
    SortQuery,
    UpdateInput
} from '../types';

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
    // constructor(mapper?: IModelEntityMapper<T>): void;
    delete(id: string): Promise<OperationResult>;
    deleteMany(params: IQueryBuilder<T>): Promise<OperationResult>;
    get(id: string): Promise<T | null>;
    getMany(params: IQueryBuilder<T>): Promise<T[]>;
    save(data: SaveInput<T>): Promise<T>;
    update(id: string, data: UpdateInput<T>): Promise<OperationResult>;
    updateMany(params: IQueryBuilder<T>, data: UpdateInput<T>): Promise<OperationResult>;
      // async count<T>(name: string, query: any): Promise<number> {}
    
      // async aggregate<T>(name: string, query: any): Promise<T[]> {}
    
      // async distinct<T>(name: string, query: any): Promise<T[]> {}
    
      // async exists<T>(name: string, query: any): Promise<boolean> {}
    
      // async createMany<T>(name: string, query: any): Promise<number> {}
    
      // async createIndexes<T>(name: string, query: any): Promise<number> {}
    
      // async dropIndexes<T>(name: string, query: any): Promise<number> {}
    
      // async drop<T>(name: string, query: any): Promise<number> {}
    
      // async dropDatabase<T>(name: string, query: any): Promise<number> {}
    
      // async createCollection<T>(name: string, query: any): Promise<number> {}
    
      // async renameCollection<T>(name: string, query: any): Promise<number> {}
    
      // async listCollections<T>(name: string, query: any): Promise<number> {}
    
      // async listIndexes<T>(name: string, query: any): Promise<number> {}
    
      // async stats<T>(name: string, query: any): Promise<number> {}
    
      // async initializeOrderedBulkOp<T>(name: string, query: any): Promise<number> {}
    
      // async initializeUnorderedBulkOp<T>(name: string, query: any): Promise<number> {}
    
      // async bulkWrite<T>(name: string, query: any): Promise<number> {}
    
      // async findAndModify<T>(name: string, query: any): Promise<number> {}
    
      // async findAndRemove<T>(name: string, query: any): Promise<number> {}
    
      // async findOneAndDelete<T>(name: string, query: any): Promise<number> {}
    
      // async findOneAndReplace<T>(name: string, query: any): Promise<number> {}
    
      // async findOneAndUpdate<T>(name: string, query: any): Promise<number> {}
    
      // async geoHaystackSearch<T>(name: string, query: any): Promise<number> {}
    
      // async geoNear<T>(name: string, query: any): Promise<number> {}
    
      // async group<T>(name: string, query: any): Promise<number> {}
    
      // async indexExists<T>(name: string, query: any): Promise<number> {}
    
      // async indexInformation<T>(name: string, query: any): Promise<number> {}
    
      // async isCapped<T>(name: string, query: any): Promise<number> {}
    
      // async mapReduce<T>(name: string, query: any): Promise<number> {}
    
      // async options<T>(name: string, query: any): Promise<number> {}
    
      // async parallelCollectionScan<T>(name: string, query: any): Promise<number> {}
    
      // async reIndex<T>(name: string, query: any): Promise<number> {}
    
      // async remove<T>(name: string, query: any): Promise<number> {}
    
      // async rename<T>(name: string, query: any): Promise<number> {}
    
      // async save<T>(name: string, query: any): Promise<number> {}
    
      // async watch<T>(name: string, query: any): Promise<number> {}
    
      // async unwatch<T>(name: string, query: any): Promise<number> {}
    
      // async isMaster<T>(name: string, query: any): Promise<number> {}
    
      // async buildInfo<T>(name: string, query: any): Promise<number> {}
    
      // async serverInfo<T>(name: string, query: any): Promise<number> {}
    
      // async serverStatus<T>(name: string, query: any): Promise<number> {}
    
      // async dbStats<T>(name: string, query: any): Promise<number> {}
    
      // async collStats<T>(name: string, query: any): Promise<number> {}
    
      // async validateCollection<T>(name: string, query: any): Promise<number> {}
    
      // async listDatabases<T>(name: string, query: any): Promise<number> {}
    
      // async close<T>(name: string, query: any): Promise<number> {}
    
      // async logout<T>(name: string, query: any): Promise<number> {}
    
      // async authenticate<T>(name: string, query: any): Promise<number> {}
    
      // async getNonce<T>(name: string, query: any): Promise<number> {}
    
      // async getLastError<T>(name: string, query: any): Promise<number> {}
    
      // async getLastErrorObj<T>(name: string, query: any): Promise<number> {}
    
      // async previousErrors<T>(name: string, query: any): Promise<number> {}
    
      // async resetErrorHistory<T>(name: string, query: any): Promise<number> {}
    
      // async createIndex<T>(name: string, query: any): Promise<number> {}
    
      // async ensureIndex<T>(name: string, query: any): Promise<number> {}
    
      // async dropIndex<T>(name: string, query: any): Promise<number> {}
    
      // async dropIndexes<T>(name: string, query: any): Promise<number> {}
    
      // async reIndex<T>(name: string, query: any): Promise<number> {}
    
      // async totalIndexSize<T>(name: string, query: any): Promise<number> {}
    
      // async totalSize<T>(name: string, query: any): Promise<number> {}
    
      // async dataSize<T>(name: string, query: any): Promise<number> {}
}
