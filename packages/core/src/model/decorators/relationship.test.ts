import { attribute, relationship } from '.';
import { ModelDefinition } from '..';
import { ID } from '../..';

class BiteDefinition implements ModelDefinition {
  @attribute({ allowNull: true, autoIncrement: true, primaryKey: true })
  @attribute({ allowNull: false, autoIncrement: false, primaryKey: false })
  // @ts-ignore
  get id(): ID | undefined {
    return;
  }
  type: String = 'survey';
  @attribute({ max: 3000 })
  // @ts-ignore
  get title(): String | undefined {
    return;
  }
  optional: Boolean = false;
  published: Boolean = false;
  // @ts-ignore
  @relationship({ model: 'User', field: 'id' })
  // @ts-ignore
  get employee(): String | undefined {
    return;
  }
}

describe('@decorator decorator', () => {
  it('can add custom attributes to model fields', () => {
    const biteInstance = new BiteDefinition();
    expect((biteInstance.id as any).decorated).toBeTruthy();
  });

  test('fields decorated with attributes have auto-generated "get" and "set" methods', async () => {
    const biteInstance = new BiteDefinition();
    expect((biteInstance.id as any).get).toBeTruthy();
    expect((biteInstance.id as any).set).toBeTruthy();

    (biteInstance.id as any).set(12345);
    expect(await (biteInstance.id as any).get()).not.toBeUndefined();
  });
});
