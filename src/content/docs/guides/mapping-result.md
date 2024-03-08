---
title: Mapping Result
description: Learn how to transform the value inside a Result using map and mapErr methods.
---

In programming, we need to transform values. But how do we transform a `Result`?

One way is shown in the previous example [Checking And Unwrapping](/guides/checking-and-unwrapping/):
we can check if the `Result` is `ok` or `err`, then unpack the value, transform it, and pack it
back into a `Result`.

```typescript
const parseNumber = (str: string): Result<number, "NOT_A_NUMBER"> => {
  const value = Number(str);
  if (isNaN(value)) return err("NOT_A_NUMBER");
  
  return ok(value);
};

const sqr = (str: string): Result<number, "NOT_A_NUMBER"> => {
  const result = parseNumber(str);
  if (result.isErr()) return result;
  
  const number = result.unwrap();

  return ok(number * number);
};
```

In general, this approach is fine. But we can do the same using a more elegant way:

```typescript
const sqr = (str: string): Result<number, "NOT_A_NUMBER"> =>
  parseNumber(str).map((number) => number * number);
```

Similarly, we can transform the `err` value using `mapErr`:

```typescript
const div = (a: number, b: number): Result<number, "INFINITY" | "INDETERMINATE"> =>
  b !== 0 ? ok(a / b) :
  a !== 0 ? err("INFINITY") :     /* n / 0 = Infinity, where n !== 0 */
            err("INDETERMINATE"); /* 0 / 0 = Indeterminate form */

const linearEq = (a: number, b: number): Result<number, "NO_ROOTS" | "INF_ROOTS"> =>
  div(-b, a)
    .mapErr((err) => (err === "INFINITY" ? "NO_ROOTS" : "INF_ROOTS"));
```

## `map` Method

`map` is a method that applies a function to the value inside an `ok` variant,
if it exists. If the `Result` is an `err`, the function will not be called, and
the `err` will be returned.

The full signature of `map` is:

```typescript
interface Result<T, E> {
  map<S>(fn: (data: T) => S): Result<S, E>
}
```

In functional programming, `map` is a common method for transforming values inside
a container. It is used in many libraries and languages, such as `Array.prototype.map` in
JavaScript, `Option.map` in Rust, and `Future.map` in Scala.

## `mapErr` Method

`mapErr` is a method that applies a function to the value inside an `err` variant,
if it exists. If the `Result` is an `ok`, the function will not be called, and
the `ok` will be returned.

The full signature of `mapErr` is:

```typescript
interface Result<T, E> {
  mapErr<F>(fn: (err: E) => F): Result<T, F>
}
```

## Functor Laws

`map` and `mapErr` obey the following laws:

- **Identity**:
  - `result.map(x => x) ≡ result` and
  - `result.mapErr(x => x) ≡ result`
- **Composition**:
  - `result.map(x => f(g(x))) ≡ result.map(g).map(f)` and
  - `result.mapErr(x => f(g(x))) ≡ result.mapErr(g).mapErr(f)`

> **Note**: `≡` means "is equivalent to".

We can use these laws to refactor our code and make code more readable,
to optimize performance or to make more universal.

## Summary

`map` and `mapErr` are powerful methods that allow us to transform the value inside
a `Result` without unwrapping it, using a pure functional approach.
