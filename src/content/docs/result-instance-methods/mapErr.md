---
title: mapErr(fn)
description: transforms err value with result of fn function
---

Applies the `fn` function to the error wrapped with `Err<E>` and returns the
result wrapped in `Err<F>`. If the result is `Ok<T>` then it is returned as is.

## Signature

```typescript
interface Result<T, E> {
  mapErr<F>(fn: (error: E) => F): Result<T, F>
}
```

## Example

```typescript
import { Result, ok, err } from '@cardellini/ts-result';

const okResult: Result<number, string> = ok(42);
const errResult = err('ERR_NOT_FOUND' as const);

const okMapped = okResult.mapErr(() => 'NOT_FOUND' as const); // Ok(42)
const errMapped = errResult.mapErr(() => 'NOT_FOUND' as const); // Err('NOT_FOUND')
```