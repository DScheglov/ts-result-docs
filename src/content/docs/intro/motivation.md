---
title: Motivation
description: A conceptual differences and practical applications of Exceptions and Result
---

TypeScript doesn't allow specifying which exceptions a function might throw.

That leads to several problems:

- **Unclear risks**: You can't tell if a function might fail just by looking at
  its signature.
- **Missed error handling**: It's easy to overlook necessary error handling.
- **Reliance on documentation**: Developers must use comments or external docs
  to understand errors, which might not be reliable.

`Result` type makes error handling explicit. Functions return either an `ok` or
`err` type, clearly indicating the possibility of failure.

So with `Result` we get:

- **Clear expectations**: Just by looking at the function signature, you know
  if you need to handle an error.
- **Forced error handling**: The compiler can enforce handling both success and
  error outcomes.
- **Self-documenting code**: No need for external documentation to understand
  error handling.

Let's see an example:

**Without `Result`:**

```typescript
function parseNumber(str: string): number {
  const value = Number(str);
  if (isNaN(value)) throw new Error("Not a number");
  
  return value;
}
```

Unclear from the signature that it can throw.

**With `Result`:**

```typescript
function parseNumber(str: string): Result<number, "NOT_A_NUMBER"> {
  const value = Number(str);
  if (isNaN(value)) return err("NOT_A_NUMBER");
  
  return ok(value);
}
```

Clearly indicates it might not succeed, guiding you to handle both cases.
Using Result in TypeScript fills the gap in error handling, making your
code safer, more predictable, and easier to maintain.

## `Result` vs Exception Throw

`Result` is not a replacement for `throw`. They serve different purposes:

- **`Result`**: Used to describe expected success and error outcomes
- **`Exception Throw`**: Used to signal when neither the expected success nor the
  expected error occurs.

So, the "expectations" are the key difference between `Result` and `Exception Throw`.

That means both versions of `parseNumber` have their place:

- **`Result`**: When we expect that the input might not be a number
- **`Exception Throw`**: When we expect that the input should always be a number

So, which one to use?

It depends on what is expected from the function and what function expects from
its caller.

Any error on expected input must cause a function to return an error, not throw
an exception. This is the main rule of thumb.
