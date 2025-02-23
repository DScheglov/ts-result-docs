---
title: Imperative Style
order: 4
---

```typescript
import { Result, ok, err, Do } from 'resultage';

type JsonObject = Record<string, unknown>;

const okIfObject = (value: unknown): Result<JsonObject, 'ERR_NOT_AN_OBJECT'> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
    ? ok(value as JsonObject)
    : err('ERR_NOT_AN_OBJECT');

const okIfInt = (value: unknown): Result<number, 'ERR_NOT_AN_INT'> =>
  Number.isInteger(value)
    ? ok(value as number)
    : err('ERR_NOT_AN_INT');

const okIfString = (value: unknown): Result<string, 'ERR_NOT_A_STRING'> =>
  typeof value === 'string'
    ? ok(value)
    : err('ERR_NOT_A_STRING');

const okIfNotEmpty = (value: string): Result<string, 'ERR_EMPTY_STRING'> =>
  value.length > 0
    ? ok(value)
    : err('ERR_EMPTY_STRING');

const okIfPositive = (value: number): Result<number, 'ERR_NOT_POSITIVE'> =>
  value > 0
    ? ok(value)
    : err('ERR_NOT_POSITIVE');

type Person = {
  name: string;
  age: number;
};

const okIfPerson = (value: unknown): Result<Person, 'ERR_INVALID_PERSON'> =>
  Do(function* () {
    const obj = yield* okIfObject(value);
    const name = yield* okIfString(obj.name).chain(okIfNotEmpty);
    const age = yield* okIfInt(obj.age).chain(okIfPositive);

    return { name, age };
  }).mapErr(() => "ERR_INVALID_PERSON");

console.log(okIfPerson({ name: 'John', age: 42 }));
// prints Ok { value: { name: 'John', age: 42 } }

console.log(okIfPerson({ name: 'John', age: -42 }));
// prints Err { error: 'ERR_INVALID_PERSON' }

console.log(okIfPerson({ name: '', age: 42 }));
// prints Err { error: 'ERR_INVALID_PERSON' }

console.log(okIfPerson({ name: 42, age: 42 }));
// prints Err { error: 'ERR_INVALID_PERSON' }

console.log(okIfPerson({ name: 'John' }));
// prints Err { error: 'ERR_INVALID_PERSON' }

console.log(okIfPerson({ age: 42 }));
// prints Err { error: 'ERR_INVALID_PERSON' }

console.log(okIfPerson(''));
// prints Err { error: 'ERR_INVALID_PERSON' }

console.log(okIfPerson(null));
// prints Err { error: 'ERR_INVALID_PERSON' }

console.log(okIfPerson(undefined));
// prints Err { error: 'ERR_INVALID_PERSON' }
```
