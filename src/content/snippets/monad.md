# Monad

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
