import { Model, ModelDefinition } from '..';

export class ModelReuseError<T extends ModelDefinition> extends Error {
  constructor(model: Model<T>) {
    super(
      `Model ${model.name} has already been added to a domain${model.domain?.name ? ` (${model.domain.name})` : ''}`,
    );
    this.name = 'ModelReuseError';
  }
}

export class ModelNameReuseError<T extends ModelDefinition> extends Error {
  constructor(model: Model<T>) {
    super(`A model with the name ${model.name} has already been added to this domain`);
    this.name = 'ModelNameReuseError';
  }
}
