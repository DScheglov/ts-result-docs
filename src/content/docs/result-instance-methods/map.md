---
title: map(fn)
description: transforms ok value with result of fn function
---

Applies the `fn` function to the value wrapped with `Ok<T>` and returns the result
wrapped in `Ok<S>`. If the result is `Err<E>` then it is returned as is.

## Signature

```typescript
interface Result<T, E> {
  map<S>(fn: (data: T) => S): Result<S, E>
}
```

## Example

```typescript
import { Result, ok, err } from 'resultage';

const okResult = ok(42);
const errResult: Result<number, 'ERR_NOT_FOUND'> = err('ERR_NOT_FOUND');

const okMapped = okResult.map((x) => x + 1); // Ok(43)
const errMapped = errResult.map((x) => x + 1); // Err('ERR_NOT_FOUND')
```
