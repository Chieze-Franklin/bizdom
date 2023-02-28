import { ID } from '../..';

export interface ModelDefinition {}

export interface IdModelDefinition extends ModelDefinition {
  id: ID;
}

export interface MongoIdModelDefinition extends ModelDefinition {
  _id: ID;
}

export interface TimestampModelDefinition extends ModelDefinition {
  createdAt: Date;
  updatedAt: Date;
}
