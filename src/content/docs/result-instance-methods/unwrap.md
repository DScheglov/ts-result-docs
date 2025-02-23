---
title: unwrap()
description: unwraps the result and returns the value or throws an error
---

Returns the value wrapped with `Ok<T>` or throws an exception if the result
is `Err<E>`.

The thrown exception is an instance of `TypeError` with the `cause` property
that contains the error value.

## Signature

```typescript
interface Result<T, E> {
  unwrap(): T
}
```

## Example

```typescript
import { ok, err } from 'resultage';

const okResult = ok(42);
const errResult = err('ERR_NOT_FOUND' as const);

okResult.unwrap();
// 42
errResult.unwrap();
// throws TypeError('Cannot unpack an Err result', { cause: 'ERR_NOT_FOUND' })
```
