import { attribute, relationship } from '.';
import { ModelDefinition } from '..';
import { ID } from '../..';

class EmployeeDefinition implements ModelDefinition {
  @attribute({ allowNull: false, autoIncrement: true, primaryKey: true })
  // @ts-ignore
  get id(): ID | undefined {
    return;
  }
  email: String = '';
  firstName: String = '';
  lastName: String = '';
  optional: Boolean = false;
  published: Boolean = false;
  // @ts-ignore
  @relationship({ model: 'Company', field: 'id' })
  // @ts-ignore
  get company(): String | undefined {
    return;
  }
}

describe('@relationship decorator', () => {
  it('can add custom attributes to model fields', () => {
    const biteInstance = new EmployeeDefinition();
    expect((biteInstance.id as any).decorated).toBeTruthy();
  });

//   test('fields decorated with attributes have auto-generated "get" and "set" methods', async () => {
//     const biteInstance = new BiteDefinition();
//     expect((biteInstance.id as any).get).toBeTruthy();
//     expect((biteInstance.id as any).set).toBeTruthy();

//     (biteInstance.id as any).set(12345);
//     expect(await (biteInstance.id as any).get()).not.toBeUndefined();
//   });
});
