# Datadom

This package is designed to help you capture your business domains, domain models, and domain rules.

## Goals

The primary goal of this project is to create a technology-agnostic way of representing business domains (with their models, rules, and logic) so that projects can be built in a truly [domain-driven](https://en.wikipedia.org/wiki/Domain-driven_design) manner. By doing so:

- We can produce code that's easier to picture because we use explicit models, rules, and logic.
- We can produce clean code with obvious layers of abstraction and reduced dependencies on tools.
- We can produce domain-specific code that can be used anywhere (frontend, backend, mobile, etc.) because there is a very clear distinction between _our domain ideas_ and _the tools used in implementing those ideas_.
- We can easily define domain boundaries, which is useful whether you are working on a monolith or a microservice.
- It becomes easier to deal with models that may have different representations in different data sources. For instance, it becomes easier for a model to be read from (and written to) both a Postgres database and [ContentStack](https://www.contentstack.com/).

## Installation

```bash
npm i @datadom/core
```

## Domain

This represents the problem space your project occupies and provides a solution to.

```ts
import { Domain } from '@datadom/core';

const domain = new Domain();
```

[Read more ➡️](https://github.com/Chieze-Franklin/datadom/wiki/Domain)

## Models

These represent your business entities. Models are created from model definitions, which are representations of their shapes.

```ts
import { ID, Domain, Model, ModelDefinition } from '@datadom/core';

class AchievementDefinition implements ModelDefinition {
  id?: ID;
  issueDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

const achievementModel = new Model<AchievementDefinition>(AchievementDefinition);

const domain = new Domain();
domain.addModel('achievement', achievementModel);
```

[Read more ➡️](https://github.com/Chieze-Franklin/datadom/wiki/Models)

## Attributes

Fields in models can be decorated with custom attributes. This is useful for specifying information that may not be derived from TypeScript's type system.

Attributes are applied on fields using the `@attribute` decorator. The decorated field has to be a [getter function](https://www.typescriptlang.org/docs/handbook/2/classes.html#getters--setters).

```ts
import { attribute, ID, ModelDefinition } from '@datadom/core';

class BiteDefinition implements ModelDefinition {
  @attribute({ primaryKey: true })
  @attribute({ allowNull: false, autoIncrement: true })
  get id(): ID | undefined {
    return;
  }
  type: String = 'survey';
  @attribute({ max: 3000 })
  get title(): String | undefined {
    return;
  }
  optional: Boolean = false;
  published: Boolean = false;
}
```

You can add multiple `@attribute` decorators to a field. They will all be merged together, with the top attributes overriding the bottom attributes.

Attributes applied to a field can be gotten during runtime by calling the auto-generated `attributes` field on the decorated field.

```ts
const biteInstance = new BiteDefinition();
console.log(biteInstance.id as any).attributes) // { allowNull: false, autoIncrement: true, primaryKey: true }
```

You may get and set the values of the decorated field using the auto-generated `get` and `set` methods on the field.

```ts
const biteInstance = new BiteDefinition();
(biteInstance.id as any).set('12345')
console.log(biteInstance.id as any).get()) // '12345'
```

Note that when saving to a data store `biteInstance.id` will be saved as a simple value (in this case it will be saved as `'12345'`).

[Read more ➡️](https://github.com/Chieze-Franklin/datadom/wiki/Attributes)
