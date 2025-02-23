---
title: chain(fn)
description: runs fn function if result is ok and returns the result
---

Applies the `fn` function to the value wrapped with `Ok<T>` and returns the result
that must be a `Result<S, F>`. If the result is `Err<E>` then it is returned as is.

## Signature

```typescript
interface Result<T, E> {
  chain<S, F>(next: (data: T) => Result<S, F>): Result<S, F | E>
}
```

## Example

```typescript
import { Result, ok, err } from 'resultage';

const div = (a: number, b: number): Result<number, 'ERR_DIV_BY_ZERO'> => (
  b === 0
    ? err('ERR_DIV_BY_ZERO')
    : ok(a / b)
);

const sqrt = (x: number): Result<number, 'ERR_NEGATIVE'> => (
  x < 0
    ? err('ERR_NEGATIVE')
    : ok(Math.sqrt(x))
);

const okResult = div(18, 2).chain((x) => sqrt(x)); // Ok(3)
const errResult1 = div(1, 0).chain((x) => sqrt(x)); // Err('ERR_DIV_BY_ZERO')
const errResult2 = div(-9, 1).chain((x) => sqrt(x)); // Err('ERR_NEGATIVE')
```
