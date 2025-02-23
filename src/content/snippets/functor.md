# Functor

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
