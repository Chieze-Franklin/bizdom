import { DataAccessObject, ModelDefinition } from '@datadom/core';
import { DataTypes, Sequelize } from 'sequelize';

export class SequelizeDataAccessObject implements DataAccessObject {
  constructor(public sequelize: Sequelize) {}

  addModel<T extends ModelDefinition>(name: string, definition: T): void {
    // const seqModelDefinition: Record<string, any> = {};
    // Object.keys(definition).forEach((key: string) => {
    //     seqModelDefinition[key] = {
    //         type: DataTypes.STRING,
    //         allowNull: false,
    //         autoIncrement: false,
    //         primaryKey: false,
    //     };
    // });
    const seqModelDefinition: Record<string, any> = Object.keys(definition).reduce(
      (obj: Record<string, any>, key: string) => {
        obj[key] = {
          type: DataTypes.STRING,
          allowNull: false,
          autoIncrement: false,
          primaryKey: false,
        };
        return obj;
      },
      {},
    );
    this.sequelize.define(name, seqModelDefinition);
  }
}
