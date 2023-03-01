import { attribute } from '.';
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
}

describe('@attributes decorator', () => {
  it('can add custom attributes to model fields', () => {
    const biteInstance = new BiteDefinition();
    expect((biteInstance.id as any).decorated).toBeTruthy();
    expect((biteInstance.id as any).attributes).toBeTruthy();
  });

  test('attributes override those coming below/after them', () => {
    const biteInstance = new BiteDefinition();
    expect((biteInstance.id as any).attributes).toEqual({ allowNull: true, autoIncrement: true, primaryKey: true })
  });

  test('fields decorated with attributes have auto-generated "get" and "set" methods', () => {
    const biteInstance = new BiteDefinition();
    expect((biteInstance.id as any).get).toBeTruthy();
    expect((biteInstance.id as any).set).toBeTruthy();

    (biteInstance.id as any).set(12345);
    expect((biteInstance.id as any).get()).toBe(12345);
  });
});
