---
title: chainErr(fn)
description: runs fn function if result is err and returns the result
---

Applies the `fn` function to the error wrapped with `Err<E>` and returns the result
that must be a `Result<S, F>`. If the result is `Ok<T>` then it is returned as is.

## Signature

```typescript
interface Result<T, E> {
  chainErr<S, F>(next: (error: E) => Result<S, F>): Result<T | S, F>
}
```

## Example

```typescript
import { Result, ok, err } from '@cardellini/ts-result';

type Complex = { re: number; im: number; };

const sqrt = (x: number): Result<number, 'ERR_NEGATIVE'> => (
  x < 0
    ? err('ERR_NEGATIVE')
    : ok(Math.sqrt(x))
);

const complexSqrt = (x: number): number | Complex =>
  sqrt(x)
    .chainErr(() => sqrt(-1))
    .unwrap();

const real = complexSqrt(49); // 7
const complex = complexSqrt(-49); // { re: 0, im: 7 }
```