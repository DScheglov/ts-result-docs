---
title: Creating Result
description: how to create a result
---

The value of type `Result<T, E>` could be created with the factory
functions `ok` and `err`:

```typescript
import { ok, err } from '@cardellini/ts-result';

const okResult = ok(42); // Result<number, never>
const errResult = err('ERR_NOT_FOUND' as const); // Result<never, 'ERR_NOT_FOUND'>
```

### Factory `ok`

The `ok` factory function creates a result of type `Result<T, never>`:

Signature:

```typescript
function ok<T>(value: T): Result<T, never>;
```

### Factory `err`

The `err` factory function creates a result of type `Result<never, E>`:

Signature:

```typescript
function err<E>(error: E): Result<never, E>;
```

### Example (ok if value is an integer)

```typescript
import { Result, ok, err } from '@cardellini/ts-result';

const okIfInt = (value: unknown): Result<number, 'ERR_NOT_AN_INT'> =>
  Number.isInteger(value)
    ? ok(value as number)
    : err('ERR_NOT_AN_INT');

console.log(okIfInt(42));
// prints: Ok { value: 42 }
console.log(okIfInt('42'));
// prints: Err { error: 'ERR_NOT_AN_INT' }
console.log(okIfInt(42.42));
// prints: Err { error: 'ERR_NOT_AN_INT' }
```

## Conditional Result Creation

The library provides a set of functions to create a result based on
some condition:

- `okIf(value, predicate, fallback) => Result`
- `okIfExists(value, fallback) => Result`
- `expect(predicate, fallback) => (value) => Result`
- `expectExists(fallback) => (value) => Result`

### function `okIf`

The `okIf` function creates a result with the `Ok<T>` type if the
`predicate` function returns `true` for the `value` argument, otherwise
it creates a result with the `Err<E>` type with the `fallback` value:

Signature (1):

```typescript
function okIf<T, S extends T, F>(
  value: T,
  guard: (data: T) => data is S,
  fallback: F | ((value: Exclude<T, S>) => F)
): Result<S, F>
```

Where:

- `value` is a value of type `T` to be wrapped with `Ok<S>`, if `guard` returns `true`
- `guard` is a type-guard function
- `fallback` is a value or a function that returns a value of type `F` to be wrapped with `Err<F>`, if `guard` returns `false`

Signature (2):

```typescript
function okIf<T, F>(
  value: T,
  predicate: (data: T) => boolean,
  fallback: F | ((value: T) => F)
): (value: T) => Result<T, F>;
```

Where:

- `value` is a value of type `T` to be wrapped with `Ok<T>`,
  if `predicate` returns `true`
- `predicate` is a predicate function
- `fallback` is a value or a function that returns a value of type `F`
  to be wrapped with `Err<F>`, if `predicate` returns `false`

Returns:

- `Result<T, F>`

Example:

```typescript
import { okIf } from '@cardellini/ts-result';

const isInt = (value: unknown): value is number => Number.isInteger(value);

const okIfInt = (value: unknown) =>
  okIf(value, isInt, "ERR_NOT_AN_INT" as const);
```

The `okIfInt` function has type `(value: unknown) => Result<number, 'ERR_NOT_AN_INT'>`.

### function `okIfExists`

The `okIfExists` function creates a result with the `Ok<T>` type if the
`value` argument is not `undefined` or `null`, otherwise it creates a
result with the `Err<E>` type with the `fallback` value:

Signature:

```typescript
function okIfExists<T, F>(
  value: T | undefined | null,
  fallback: F | ((value: undefined | null) => F)
): Result<Exclude<T, undefined | null>, F>;
```

Where:

- `value` is a value of type `T | null | undefined` to be wrapped with `Ok<T>`,
  if it is not `undefined` or `null`
- `fallback` is a value or a function that returns a value of type `F`
  to be wrapped with `Err<F>`, if `value` is `undefined` or `null`

Example:

```typescript
import { okIfExists } from '@cardellini/ts-result';

const findGreaterThen2 = (numbers: number[]) =>
  okIfExists(
    numbers.find((x) => x > 2),
    "ERR_NOT_FOUND_GT_2" as const
  );
```

The `findGreaterThen2` function has type `(numbers: number[]) => Result<number, 'ERR_NOT_FOUND_LT_2'>`.

### function `expect`

The `expect` function creates a function that returns a result with the
`Ok<T>` type if the `predicate` function returns `true` for the `value`
argument, otherwise it returns a result with the `Err<E>` type with the
`fallback` value:

Signature (1):

```typescript
function expect  <T, S extends T, F>(
  guard: (data: T) => data is S,
  fallback: F | ((value: Exclude<T, S>) => F)
): (value: T) => Result<S, F>;
```

Where:

- `guard` is a type-guard function
- `fallback` is a value or a function that returns a value of type `F`
  to be wrapped with `Err<F>`, if `guard` returns `false`

Signature (2):

```typescript
function expect<T, F>(
  predicate: (data: T) => boolean,
  fallback: F | ((value: T) => F)
): (value: T) => Result<T, F>;
```

Where:

- `predicate` is a predicate function
- `fallback` is a value or a function that returns a value of type `F`
  to be wrapped with `Err<F>`, if `predicate` returns `false`

Returns:

- `(value: T) => Result<T, F>`

Example:

```typescript
import { expect } from '@cardellini/ts-result';

const isInt = (value: unknown): value is number => Number.isInteger(value);

const okIfInt = expect(isInt, "ERR_NOT_AN_INT" as const);
```

The `okIfInt` function has type `(value: unknown) => Result<number, 'ERR_NOT_AN_INT'>`.

### function `expectExists`

The `expectExists` function creates a function that returns a result
with the `Ok<T>` type if the `value` argument is not `undefined` or
`null`, otherwise it returns a result with the `Err<E>` type with the
`fallback` value:

Signature:

```typescript
function expectExists<T, F>(
  fallback: F | ((value: undefined | null) => F)
): (value: T | undefined | null) => Result<T, F>;
```

Where:

- `fallback` is a value or a function that returns a value of type `F`
  to be wrapped with `Err<F>`, if `value` is `undefined` or `null`

Returns:

- `(value: T | undefined | null) => Result<T, F>`

Example:

```typescript
import { expectExists } from "@cardellini/ts-result";
import { pipe } from "@cardellini/ts-result/fn";

const findGreaterThen2 = (numbers: number[]) =>
  pipe(
    numbers.find((x) => x > 2),
    expectExists("ERR_NOT_FOUND_LT_2" as const)
  );
```

## Always Declare Return Type of Functions That Return Result

It is recommended to always declare the return type of functions that
return `Result` type. There are several reasons for that:

1) It requires developer to explicitly express which result is expected
2) It helps compiler replace `Ok<T> | Err<E>` type with `Result<T, E>`
3) It localizes the place where mistake can be made
