---
title: Chaining Computations
description: Learn how to chain functions returning a Result.
---

Let's guess we have the following functions:

```typescript
const okIfInt = (value: unknown): Result<number, 'ERR_NOT_AN_INT'> =>
  Number.isInteger(value) ? ok(value as number) : err('ERR_NOT_AN_INT');

const okIfPositive = (value: number): Result<number, 'ERR_NOT_POSITIVE'> =>
  value > 0 ? ok(value) : err('ERR_NOT_POSITIVE');
```

And we want to check if value is a positive integer.
Currently we know two main ways to operate with `Result`:

1. Unwrap the value and check it manually
2. Use the `map` method

```typescript
// Unwrapping
const okIfPositiveIntUnwrap =
  (value: unknown): Result<number, 'ERR_NOT_AN_INT' | 'ERR_NOT_POSITIVE'> => {
    const result = okIfInt(value);
    if (result.isErr()) return result;

    const int = result.unwrap();
    return okIfPositive(int);
  };

// Mapping
const okIfPositiveIntMap =
  (value: unknown): Result<number, 'ERR_NOT_AN_INT' | 'ERR_NOT_POSITIVE'> => {
    const result = okIfInt(value).map(
      (int) => okIfPositive(int)
    );

    return result.isErr() ? result : result.unwrap();
  }
```

Seems like both ways are not very elegant and readable.

The `Result` type has a method `chain` that allows us to chain functions that
return a `Result`, so we can rewrite the `okIfPositiveInt` in the following way:

```typescript
const okIfPositiveInt =
  (value: unknown): Result<number, 'ERR_NOT_AN_INT' | 'ERR_NOT_POSITIVE'> =>
    okIfInt(value).chain(
      (int) => okIfPositive(int)
    );
```

or even more concise:

```typescript
const okIfPositiveInt =
  (value: unknown): Result<number, 'ERR_NOT_AN_INT' | 'ERR_NOT_POSITIVE'> =>
    okIfInt(value).chain(okIfPositive);
```

Now, let's guess we need to use some constant if the value is not a positive integer:

```typescript
const okIfPositiveIntWithDefault =
  (value: unknown, defaultValue: number): Result<number, 'ERR_NOT_AN_INT'> =>
    okIfPositiveInt(value).chainErr(
      error => error === 'ERR_NOT_POSITIVE'
        ? ok(defaultValue)
        : err(error)
    );
```

## `chain` Method

The `chain` calls the function passed to it with the value inside the `ok` variant,
if it exists. If the `Result` is an `err`, the function will not be called, and the
`err` will be returned.

The full signature of `chain` is:

```typescript
interface Result<T, E> {
  chain<S, F>(fn: (data: T) => Result<S, F>): Result<S, E | F>
}
```

## `chainErr` Method

The `chainErr` is the same as `chain` but for `err` values.
It calls the function passed to it with the value inside the `err` variant, if it exists.
If the `Result` is an `ok`, the function will not be called, and the `ok` will be returned.

The full signature of `chainErr` is:

```typescript
interface Result<T, E> {
  chainErr<S, F>(fn: (err: E) => Result<S, F>): Result<T | S, F>
}
```

The `chainErr` method is a good way to recover from errors.

## Monadic Laws

Methods `chain` and `chainErr` satisfy the following laws:

- **Left identity**:
  - `ok(x).chain(f) ≡ f(x)`
  - `err(x).chainErr(f) ≡ f(x)`
- **Right identity**:
  - `result.chain(ok) ≡ result`
  - `result.chainErr(err) ≡ result`
- **Associativity**:
  - `result.chain(f).chain(g) ≡ result.chain(x => f(x).chain(g))`
  - `result.chainErr(f).chainErr(g) ≡ result.chainErr(x => f(x).chainErr(g))`

> *Note*: `≡` means that the two sides are equivalent, `f` and `g` are functions
that return a `Result`.

We can use these laws to refactor our code and make it more readable.
