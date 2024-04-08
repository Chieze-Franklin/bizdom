# Datadom

This package is designed to help you define, tests, and execute your business domains, domain models, and domain rules.

## Goals

The primary goal of this project is to create a technology-agnostic way of representing business domains (with their models, rules, and logic) so that projects can be built in a truly [domain-driven](https://en.wikipedia.org/wiki/Domain-driven_design) manner. By doing so:

- We can produce code that's easier to picture because we use explicit models, rules, and logic.
- We can produce clean code with obvious layers of abstraction and reduced dependencies on tools.
- We can produce domain-specific code that can be used anywhere (frontend, backend, mobile, etc.) because there is a very clear distinction between _our domain ideas_ and _the tools used in implementing those ideas_.
- We can easily define domain boundaries, which is useful whether you are working on a monolith or a microservice.
- It becomes easier to separate side effects from domain rules and logic.

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

Domain models map to your business entities.

Datadom does not provide specific facilities for representing domain models.
There is no interface to implement or class to inherit.

[Read more ➡️](https://github.com/Chieze-Franklin/datadom/wiki/Model)

## Repositories

A repository is an object that represents a collection of models. Typically, a repository
would be responsible for CRUD (Create Read Update Delete) operations on models.

```ts
import { ID, IRepository } from '@datadom/core';

interface ICharacter {
  id?: ID;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ICharacterRepository extends IRepository<ICharacter> {}

export class CharacterRepository implements ICharacterRepository {
    count(params?: IQueryBuilder<ICharacter>): Promise<number> {
        throw new Error('Method not implemented.');
    }
    delete(id: ID): Promise<OperationResult> {
        throw new Error('Method not implemented.');
    }
    deleteMany(params: IQueryBuilder<ICharacter>): Promise<OperationResult> {
        throw new Error('Method not implemented.');
    }
    exists(params: IQueryBuilder<ICharacter>): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    get(id: ID): Promise<ICharacter | null> {
        throw new Error('Method not implemented.');
    }
    getMany(params?: IQueryBuilder<ICharacter>): Promise<ICharacter[]> {
        throw new Error('Method not implemented.');
    }
    save(data: SaveInput<ICharacter>): Promise<ICharacter> {
        throw new Error('Method not implemented.');
    }
    update(id: ID, data: UpdateInput<ICharacter>): Promise<OperationResult> {
        throw new Error('Method not implemented.');
    }
    updateMany(params: IQueryBuilder<ICharacter>, data: UpdateInput<ICharacter>): Promise<OperationResult> {
        throw new Error('Method not implemented.');
    }
}
```

[Read more ➡️](https://github.com/Chieze-Franklin/datadom/wiki/Repository)

## Services

A service is a wrapper around a repository.

Whenever you register a repository in the domain by calling `domain.registerRepository`,
a service of the same name is created under the hood. This service exposes the same methods exposed by the repository.
However, a service ensures that the relevant rules, events, and middleware are run before and
after certain repository actions.

```ts
import { Domain } from '@datadom/core';
import { CharacterRepository } from './characters';

const domain = new Domain();

domain.registerRepository('character', new CharacterRepository());
```

It is, however, possible to create a service without a concrete repository by calling `domain.createService`.
This way, you can attach all the domain rules, hooks, and event listeners to the service without worrying
about the actual repository that will be associated with the service.

```ts
import { Domain } from '@datadom/core';

const domain = new Domain();

domain.createService('character');
```

Services created this way are associated with a default repository of type `NullRepository`.

To associated a repository to a service created this way, simply call `domain.registerRepository`.
The `NullRepository` repository will be replaced with the provided repository, and all the service's
previously-added rules, hooks, and event listeners will continue to function as expected. This is
great for ensuring domain code remains decoupled from infrastructure code.

```ts
domain.registerRepository('character', new CharacterRepository());
```

After registering a repository with a domain, you can access the wrapping service in a number of ways,
depending on how strict your type-checking is.

```ts
// access the character service using any of the following notations:

domain.$('character');
(domain as any).$character;
(domain as any)['$character'];
domain.$character; // without strict type-checking
domain['$character']; // without strict type-checking
```

You can attach various hooks, rules, and event listeners to a service to perform actions before and after
various repository operations. This helps the repository methods to concerned with only their tasks and not
have to worry about preconditions, checks, and side effects.

```ts
domain.$('character').addRule('save', (data) => {
  console.log('This rule runs before an entity is saved by the repository');

  // ensure that the entity to be saved has a "name" field
  return !!(data.name);
});
domain.$('character').pre('save', (data, next) => {
  console.log('This hook/middleware runs before an entity is saved by the repository');

  // call "next" to continue to the next middleware in the chain
  // you can call "next" like this "next(data)" or simply like this "next()"
  return next();
});
domain.$('character').pre('save', (data, next) => {
  console.log('This hook/middleware runs before an entity is saved by the repository');

  // call "next" to continue to the next middleware in the chain
  // you can call "next" like this "next(data)" or simply like this "next()"
  return next(data);
});
domain.$('character').pre('save', (data, next) => {
  console.log('This hook/middleware alters the entity that is to be saved by the repository');

  return next({ ...data, field1: 'This field was added in a middleware' });
});
domain.$('character').on('save', () => console.log('This event handler runs after an entity is saved by the repository'));
```

[Read more ➡️](https://github.com/Chieze-Franklin/datadom/wiki/Service)

## Rules

Rules are functions that resolve to boolean values and are executed before repository operations.
A resolved value of `false` means the rule is violated, and the repository operation should not continue.

Rules can be attached to a specific service or to the domain object, in which case they are available to every service
in the domain.

```ts
import { Domain } from '@datadom/core';

const domain = new Domain();

async function entityMustHaveId(data) {
  return !!(data?.id);
}

domain.addRule('save', entityMustHaveId);
```

The rule `entityMustHaveId` will be executed whenever a repository wants to _save_ an entity.

[Read more ➡️](https://github.com/Chieze-Franklin/datadom/wiki/Rule)

<!-- ## Attributes

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

[Read more ➡️](https://github.com/Chieze-Franklin/datadom/wiki/Attributes) -->
