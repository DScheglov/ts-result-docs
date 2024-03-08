---
title: Getting Started
description: A guide to start using Result
---

## Installation

```bash
npm install @cardellini/ts-result
```

## Usage

```typescript
import { Do, Result, ok, err } from '@cardellini/ts-result';

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
    const obj = yield* okIfObject(value).unwrapGen();
    const name = yield* okIfString(obj.name).unwrapGen();
    const age = yield* okIfInt(obj.age).unwrapGen();

    return { name, age };
  });

const person: Person = okIfPerson({ name: 'John', age: 42 }).unwrap();

console.log(person);
// prints: { name: 'John', age: 42 }
```

[Run In Sandbox](/sandbox#aW1wb3J0IHsgRG8sIFJlc3VsdCwgb2ssIGVyciB9IGZyb20gJ0BjYXJkZWxsaW5pL3RzLXJlc3VsdCc7Cgp0eXBlIEpzb25PYmplY3QgPSBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjsKCmNvbnN0IG9rSWZPYmplY3QgPSAodmFsdWU6IHVua25vd24pOiBSZXN1bHQ8SnNvbk9iamVjdCwgJ0VSUl9OT1RfQU5fT0JKRUNUJz4gPT4KICB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICE9PSBudWxsICYmICFBcnJheS5pc0FycmF5KHZhbHVlKQogICAgPyBvayh2YWx1ZSBhcyBKc29uT2JqZWN0KQogICAgOiBlcnIoJ0VSUl9OT1RfQU5fT0JKRUNUJyk7Cgpjb25zdCBva0lmSW50ID0gKHZhbHVlOiB1bmtub3duKTogUmVzdWx0PG51bWJlciwgJ0VSUl9OT1RfQU5fSU5UJz4gPT4KICBOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKQogICAgPyBvayh2YWx1ZSBhcyBudW1iZXIpCiAgICA6IGVycignRVJSX05PVF9BTl9JTlQnKTsKCmNvbnN0IG9rSWZTdHJpbmcgPSAodmFsdWU6IHVua25vd24pOiBSZXN1bHQ8c3RyaW5nLCAnRVJSX05PVF9BX1NUUklORyc%2BID0%2BCiAgdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJwogICAgPyBvayh2YWx1ZSkKICAgIDogZXJyKCdFUlJfTk9UX0FfU1RSSU5HJyk7Cgp0eXBlIFBlcnNvbiA9IHsKICBuYW1lOiBzdHJpbmc7CiAgYWdlOiBudW1iZXI7Cn0KCmNvbnN0IG9rSWZQZXJzb24gPSAodmFsdWU6IHVua25vd24pID0%2BCiAgRG8oZnVuY3Rpb24qKCkgewogICAgY29uc3Qgb2JqID0geWllbGQqIG9rSWZPYmplY3QodmFsdWUpLnVud3JhcEdlbigpOwogICAgY29uc3QgbmFtZSA9IHlpZWxkKiBva0lmU3RyaW5nKG9iai5uYW1lKS51bndyYXBHZW4oKTsKICAgIGNvbnN0IGFnZSA9IHlpZWxkKiBva0lmSW50KG9iai5hZ2UpLnVud3JhcEdlbigpOwoKICAgIHJldHVybiB7IG5hbWUsIGFnZSB9OwogIH0pOwoKY29uc3QgcGVyc29uOiBQZXJzb24gPSBva0lmUGVyc29uKHsgbmFtZTogJ0pvaG4nLCBhZ2U6IDQyIH0pLnVud3JhcCgpOwoKY29uc29sZS5sb2cocGVyc29uKTsKLy8gcHJpbnRzOiB7IG5hbWU6ICdKb2huJywgYWdlOiA0MiB9Cg%3D%3D)

## Features

The library offers:

- `Result<T, E>` type
- ok and err constructors
- Type-guards for Result, `Ok<T>`, and `Err<T>`
- `Do` for composing functions returning `Result`
- `asyncDo` for asynchronous functions
- Utilities for handling arrays of `Result`-s
- Curried methods for `Result` and `AsyncResult`
- Functional utilities: `pipe`, `compose`, `identity`
