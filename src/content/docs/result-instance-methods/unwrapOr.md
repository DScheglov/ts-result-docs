---
title: unwrapOr(defaultValue)
description: unwraps the result and returns the value or defaultValue
---

Returns the value wrapped with `Ok<T>` or `defaultValue` if the result is `Err<E>`.

## Signature

```typescript
interface Result<T, E> {
  unwrapOr<S>(defaultValue: S): T | S
}
```

## Example

```typescript
import { ok, err } from '@cardellini/ts-result';

const okResult = ok(42);
const errResult = err('ERR_NOT_FOUND' as const);

okResult.unwrapOr(0); // 42
errResult.unwrapOr(0); // 0
```
