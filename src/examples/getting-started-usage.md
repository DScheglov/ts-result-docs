---
title: Getting Started - Usage
order: 3
---

```typescript
import { type Result, Do, ok, err } from 'resultage';

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

type Person = {
  name: string;
  age: number;
}

const okIfPerson = (value: unknown) =>
  Do(function*() {
    const obj = yield* okIfObject(value);
    const name = yield* okIfString(obj.name);
    const age = yield* okIfInt(obj.age);

    return { name, age };
  });

const person: Person = okIfPerson({ name: 'John', age: 42 }).unwrap();

console.log(person);
// prints: { name: 'John', age: 42 }
```
