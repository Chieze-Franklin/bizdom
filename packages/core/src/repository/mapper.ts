import { ModelDefinition } from "../model";

export interface ModelEntityMapper<T extends ModelDefinition, Entity = any> {
    toModel(entity: Entity): T;
    toEntity(model: T): Entity;
}
