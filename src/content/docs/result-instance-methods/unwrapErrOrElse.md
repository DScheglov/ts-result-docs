---
title: unwrapErrOrElse(fallback)
description: unwraps the result and returns the error or runs the fallback function
---

Returns the value of `Err<E>`. If the result is `Ok<T>` then returns the result
of `fallback(data)`.

## Signature

```typescript
interface Result<T, E> {
  unwrapErrOrElse<F>(fallback: (data: T) => F): E | F
}
```

## Example

```typescript
import { ok, err } from 'resultage';

const okResult = ok(42);
const errResult = err('ERR_NOT_FOUND' as const);

okResult.unwrapErrOrElse(() => 'NOT_FOUND'); // 'NOT_FOUND'
errResult.unwrapErrOrElse(() => 'NOT_FOUND'); // 'ERR_NOT_FOUND'
```
