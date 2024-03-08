---
title: Checking and Unwrapping
description: how to check if a result is ok or err and how to unwrap it
---

The simplest way to work with `Result<T, E>` is to explicitly check if it is `Ok<T>` or `Err<E>` and then unwrap it.

```typescript
import { ok } from '@cardellini/ts-result';

const okResult = ok(42);

if (okResult.isOk()) {
  console.log(okResult.unwrap());
}

const errResult = err('ERR_NOT_FOUND' as const);

if (errResult.isErr()) {
  console.log(errResult.unwrapErr());
}
```

## Matching

The `match` method allows to unwrap a result based on its type:

```typescript
import { ok, err } from '@cardellini/ts-result';

const okIfInt = (value: unknown): Result<number, 'ERR_NOT_AN_INT'> =>
  Number.isInteger(value)
    ? ok(value as number)
    : err('ERR_NOT_AN_INT');

const int = okIfInt(42).match(
  (value) => value * value,
  (error) => -error.length, // a little bit unexpected, but is just an example
);

console.log(int);
// prints: 42
```

## Unwrapping Throws

The `unwrap` and `unwrapErr` methods throw an error if the result is not `Ok<T>` or `Err<E>` respectively:

```typescript
import { ok, err } from '@cardellini/ts-result';

const okResult = ok(42);

okResult.unwrapErr();
// throws: TypeError: Result is not an Err. Cause: ok(42)

const errResult = err('ERR_NOT_FOUND' as const);

errResult.unwrap();
// throws: TypeError: Result is not an Ok. Cause: err('ERR_NOT_FOUND')
```

## Throwing Error Wrapped in Err

In some case it could be convenient to throw an error wrapped in `Err<E>`:

```typescript
import { ok, err } from '@cardellini/ts-result';

export class ValidationError<C extends string> extends Error {
  constructor(public path: string[], public code: C) {
    super(`Invalid value at path: ${path.join('.')}. Cause: ${code}`);
    this.name = 'ValidationError';
  }
}

export const validateInt = (
  value: unknown,
  path: string[] = [],
): Result<number, ValidationError<'ERR_NOT_AN_INT'>> =>
  Number.isInteger(value)
    ? ok(value as number)
    : err(new ValidationError(path, 'ERR_NOT_AN_INT'));

const age = validateInt('42', ['age']).unwrapOrThrow();
// throws: ValidationError: Invalid value at path: age. Cause: ERR_NOT_AN_INT
```

## Suppressing Exception Throwing

In some cases the error value could be ignored and the result could be unwrapped
with some specific fallback value, if it is `Err<E>`:

```typescript
import { Result, ok, err } from '@cardellini/ts-result';

const okIfInt = (value: unknown): Result<number, 'ERR_NOT_AN_INT'> =>
  Number.isInteger(value)
    ? ok(value as number)
    : err('ERR_NOT_AN_INT');

const value1 = okIfInt(42).unwrapOr(0);
console.log(value1);
// prints: 42

const value2 = okIfInt('42').unwrapOr(0);
console.log(value2);
// prints: 0
```

## Summary

- Use `isOk` and `isErr` to check if a result is `Ok<T>` or `Err<E>`
- Use `unwrap` and `unwrapErr` to unwrap a result
- Use `unwrapOrThrow` to unwrap a result and throw an error if it is `Err<E>`
- Use `unwrapOr` to unwrap a result with a fallback value if it is `Err<E>`
- Use `match` to unwrap a result based on its type
