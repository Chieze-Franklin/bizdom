import { ID } from '..';
import { DataAccessObject } from '../dao';
import { Model, ModelDefinition } from '../model';

export class Domain {
  constructor(private dataAccessObjects: DataAccessObject[] = []) {}

  private _modelMap: Record<string, Model<ModelDefinition>> = {};

  addModel<T extends ModelDefinition>(name: string, model: Model<T>): void {
    // TODO: check that name hasn't been used before

    model.domain = this;
    model.name = name;
    this._modelMap[name] = model;

    this.dataAccessObjects.forEach((dao) => dao.addModel(name, new model.definitionType()));
  }

  // addCheck
  // addPreHook
  // addPostHook

  async create<T extends ModelDefinition>(definition: T, params: QueryParams, meta?: QueryMeta): Promise<T> {
    // run domain checks

    // run pre hooks

    // call DAOs

    // run post hooks

    // return created instance
    return definition;
  }

  async get<T extends ModelDefinition>(params: QueryParams, meta?: QueryMeta): Promise<T | undefined> {
    return undefined;
  }

  async getMany<T extends ModelDefinition>(params: QueryParams, meta?: QueryMeta): Promise<T[]> {
    return [];
  }

  // async update<T extends Partial<ModelDefinition>>(definition: T): Promise<T> {}

  // async delete<T extends Partial<ModelDefinition>>(definition: T): Promise<T> {}

  // async find<T extends ModelDefinition>(name: string, query: any): Promise<T[]> {}

  // async findOne<T extends ModelDefinition>(name: string, query: any): Promise<T> {}

  // async count<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async aggregate<T extends ModelDefinition>(name: string, query: any): Promise<T[]> {}

  // async distinct<T extends ModelDefinition>(name: string, query: any): Promise<T[]> {}

  // async exists<T extends ModelDefinition>(name: string, query: any): Promise<boolean> {}

  // async updateMany<T extends ModelDefinition>(name: string, query: any, update: any): Promise<number> {}

  // async deleteMany<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async createMany<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async createIndexes<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async dropIndexes<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async drop<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async dropDatabase<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async createCollection<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async renameCollection<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async listCollections<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async listIndexes<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async stats<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async initializeOrderedBulkOp<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async initializeUnorderedBulkOp<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async bulkWrite<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async findAndModify<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async findAndRemove<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async findOneAndDelete<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async findOneAndReplace<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async findOneAndUpdate<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async geoHaystackSearch<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async geoNear<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async group<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async indexExists<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async indexInformation<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async isCapped<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async mapReduce<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async options<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async parallelCollectionScan<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async reIndex<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async remove<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async rename<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async save<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async watch<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async unwatch<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async isMaster<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async buildInfo<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async serverInfo<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async serverStatus<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async dbStats<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async collStats<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async validateCollection<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async listDatabases<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async close<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async logout<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async authenticate<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async getNonce<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async getLastError<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async getLastErrorObj<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async previousErrors<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async resetErrorHistory<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async createIndex<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async ensureIndex<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async dropIndex<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async dropIndexes<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async reIndex<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async totalIndexSize<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async totalSize<T extends ModelDefinition>(name: string, query: any): Promise<number> {}

  // async dataSize<T extends ModelDefinition>(name: string, query: any): Promise<number> {}
}

// include things here that should be passed to the DAO
export type QueryParams = {
  // this is where sort, filter, pagination, etc. will go
  // may change this to a generic type so that sort, filter etc. are strongly typed
  // TODO: include should be here
  model: string;
  where?: Record<string, any>;
};

// include things here that the domain should know of but not the DAO
export type QueryMeta = {
  domainAccessObjects?: string[]; // TODO: strongly type this string to names of DAOs
};
