import { Md5 } from 'ts-md5';
import { ModelDefinition } from '..';

export class GlobalContext {
  static addFieldAttributes(field: string, attributes: Record<string, any>) {
    GlobalContext._fieldAttributesMap[field] = { ...(GlobalContext._fieldAttributesMap[field] || {}), ...attributes };
  }

  static addFieldRelationship<T extends ModelDefinition>(field: string, relationship: Relationship<T>) {
    GlobalContext._fieldRelationshipMap[field] = relationship as Relationship<ModelDefinition>;
  }

  static discoverField(field: string) {
    GlobalContext._fieldDiscoveryMap[field] = true;
  }

  static fieldHasBeenDiscovered(field: string) {
    return GlobalContext._fieldDiscoveryMap[field];
  }

  private static _fieldAttributesMap: Record<string, Record<string, any>> = {};
  static get fieldAttributesMap() {
    return GlobalContext._fieldAttributesMap;
  }

  private static _fieldDiscoveryMap: Record<string, boolean> = {};
  static get fieldDiscoveryMap() {
    return GlobalContext._fieldDiscoveryMap;
  }

  private static _fieldRelationshipMap: Record<string, Relationship<ModelDefinition>> = {};
  static get fieldRelationshipMap() {
    return GlobalContext._fieldRelationshipMap;
  }
}

export type Relationship<T extends ModelDefinition> = {
  field: keyof T;
  many?: boolean;
  model: string;
};

export function getFieldHash(target: any, propertyKey: string) {
  return `${Md5.hashStr(target.constructor.name)}.${propertyKey}`;
}
