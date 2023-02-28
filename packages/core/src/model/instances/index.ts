import { OperationResult } from "../..";
import { ModelDefinition } from "../definitions";

export interface ModelInstance<T extends ModelDefinition> {
    delete(): Promise<OperationResult>;
    update(): Promise<OperationResult>;
}
