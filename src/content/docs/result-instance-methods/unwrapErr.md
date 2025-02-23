---
title: unwrapErr()
description: unwraps the error
---

Returns the error wrapped with `Err<E>` or throws an exception if the result is
`Ok<T>`.

The thrown exception is an instance of `TypeError` with the `cause` property
that contains the value wrapped with `Ok<T>`.

## Signature

```typescript
interface Result<T, E> {
  unwrapErr(): E
}
```

## Example

```typescript
import { ok, err } from 'resultage';

const okResult = ok(42);
const errResult = err('ERR_NOT_FOUND' as const);

okResult.unwrapErr();
// throws TypeError('Cannot unpack an Err result', { cause: 42 })
errResult.unwrapErr();
// 'ERR_NOT_FOUND'
```
