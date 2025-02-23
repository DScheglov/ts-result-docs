---
title: unwrapErrOr(defaultValue)
description: unwraps the result and returns the error or defaultValue
---

Returns the error wrapped with `Err<E>` or `defaultValue` if the result is `Ok<T>`.

## Signature

```typescript
interface Result<T, E> {
  unwrapErrOr<F>(defaultValue: F): E | F
}
```

## Example

```typescript
import { ok, err } from 'resultage';

const okResult = ok(42);
const errResult = err('ERR_NOT_FOUND' as const);

okResult.unwrapErrOr('NOT_FOUND'); // 'NOT_FOUND'
errResult.unwrapErrOr('NOT_FOUND'); // 'ERR_NOT_FOUND'
```
