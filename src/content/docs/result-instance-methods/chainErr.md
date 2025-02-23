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
import { Result, ok, err } from 'resultage';

type Complex = { re: number; im: number; };

const sqrt = (x: number): Result<number, 'ERR_NEGATIVE'> => (
  x < 0
    ? err('ERR_NEGATIVE')
    : ok(Math.sqrt(x))
);

const complexSqrt = (x: number): number | Complex =>
  sqrt(x)
    .chainErr(() => ok({ re: 0, im: sqrt(-x).unwrap() }))
    .unwrap();

const real = complexSqrt(49); // 7
console.log('Real', real);

const complex = complexSqrt(-49); // { re: 0, im: 7 }
console.log('Complex', complex);
```

[Run in Sandbox](http://localhost:4321/sandbox#aW1wb3J0IHsgUmVzdWx0LCBvaywgZXJyIH0gZnJvbSAnQGNhcmRlbGxpbmkvdHMtcmVzdWx0JzsKCnR5cGUgQ29tcGxleCA9IHsgcmU6IG51bWJlcjsgaW06IG51bWJlcjsgfTsKCmNvbnN0IHNxcnQgPSAoeDogbnVtYmVyKTogUmVzdWx0PG51bWJlciwgJ0VSUl9ORUdBVElWRSc%2BID0%2BICgKICB4IDwgMAogICAgPyBlcnIoJ0VSUl9ORUdBVElWRScpCiAgICA6IG9rKE1hdGguc3FydCh4KSkKKTsKCmNvbnN0IGNvbXBsZXhTcXJ0ID0gKHg6IG51bWJlcik6IG51bWJlciB8IENvbXBsZXggPT4KICBzcXJ0KHgpCiAgICAuY2hhaW5FcnIoKCkgPT4gb2soeyByZTogMCwgaW06IHNxcnQoLXgpLnVud3JhcCgpIH0pKQogICAgLnVud3JhcCgpOwoKY29uc3QgcmVhbCA9IGNvbXBsZXhTcXJ0KDQ5KTsgLy8gNwpjb25zb2xlLmxvZygnUmVhbFx0JywgcmVhbCk7Cgpjb25zdCBjb21wbGV4ID0gY29tcGxleFNxcnQoLTQ5KTsgLy8geyByZTogMCwgaW06IDcgfQpjb25zb2xlLmxvZygnQ29tcGxleFx0JywgY29tcGxleCk7Cg%3D%3D)
