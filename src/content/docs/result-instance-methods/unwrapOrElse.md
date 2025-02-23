---
title: unwrapOrElse(fallback)
description: runs fn function if result is err and returns the result
---

Returns the value of `Ok<T>`. If the result is `Err<E>` then returns the result
of `fallback(error)`.

## Signature

```typescript
interface Result<T, E> {
  unwrapOrElse<S>(fallback: (error: E) => S): T | S
}
```

## Example

```typescript
import { ok, err } from 'resultage';

const okResult = ok(42);
const errResult = err('ERR_NOT_FOUND' as const);

okResult.unwrapOrElse(() => 0); // 42
errResult.unwrapOrElse(() => 0); // 0
```
