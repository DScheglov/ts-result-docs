---
title: Imperative Style
description: working with Result in imperative style
---

Let's guess we receive some json object and need to ensure it has a specific structure.

```typescript
type Person = {
  name: string; // not empty string
  age: number; // greater than 0 integer
}
```

So, let's write the following functions to validate data:

```typescript
type JsonObject = Record<string, unknown>;

const okIfObject = (value: unknown): Result<JsonObject, 'ERR_NOT_AN_OBJECT'> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
    ? ok(value as JsonObject)
    : err('ERR_NOT_AN_OBJECT');

const okIfInt = (value: unknown): Result<number, 'ERR_NOT_AN_INT'> =>
  Number.isInteger(value)
    ? ok(value as number)
    : err('ERR_NOT_AN_INT');

const okIfString = (value: unknown): Result<string, 'ERR_NOT_A_STRING'> =>
  typeof value === 'string'
    ? ok(value)
    : err('ERR_NOT_A_STRING');

const okIfNotEmpty = (value: string): Result<string, 'ERR_EMPTY_STRING'> =>
  value.length > 0
    ? ok(value)
    : err('ERR_EMPTY_STRING');

const okIfPositive = (value: number): Result<number, 'ERR_NOT_POSITIVE'> =>
  value > 0
    ? ok(value)
    : err('ERR_NOT_POSITIVE');
```

Now we need to compose these functions to validate some json object.

In the previous section [Chaining Computations](/guides/chaining-computations/)
we've learned how to use the `chain` method to chain functions that return a `Result`.

So, let's use the `chain` method to validate the `Person` type:

```typescript
const okIfPerson =
  (value: unknown) => okIfObject(value).chain(
  (obj)            => okIfString(obj.name).chain(okIfNotEmpty).chain(
  (name)           => okIfInt(obj.age).chain(okIfPositive).chain(
  (age)            => ok({ name, age })
))).mapErr(() => 'ERR_INVALID_PERSON');
```

Doesn't look familiar, right? It's formatted in not usual way for JavaScript/TypeScript
developers.

Prettier formats this code in the following way:

```typescript
const okIfPerson = (value: unknown) =>
  okIfObject(value)
    .chain((obj) =>
      okIfString(obj.name)
        .chain(okIfNotEmpty)
        .chain((name) =>
          okIfInt(obj.age)
            .chain(okIfPositive)
            .chain((age) => ok({ name, age })),
        ),
    )
    .mapErr(() => 'ERR_INVALID_PERSON');
```

Now, we can see something wellknown. It is a hell of chaining calls. Previously we've seen
this like of `then`-hell with promises, but now we have it with `Result`.

To avoid `then`-hell with promises the `async/await` syntax was introduced in
JavaScript and Typescript.

But what about `Result`? Is there any way to avoid `chain`-hell?

Yes, there is. Some truly old guys can recall how we wrote code with promises
using generators and `yield` keyword.

The same approach can be used with `Result`:

```typescript
import { Do } from `resultage`;

const okIfPerson = (value: unknown): Result<Person, 'ERR_INVALID_PERSON'> =>
  Do(function* () {
    const obj = yield* okIfObject(value);
    const name = yield* okIfString(obj.name).chain(okIfNotEmpty);
    const age = yield* okIfInt(obj.age).chain(okIfPositive);

    return { name, age };
  }).mapErr(() => 'ERR_INVALID_PERSON');
```

[Run in Sandbox](/sandbox#aW1wb3J0IHsgUmVzdWx0LCBvaywgZXJyLCBEbyB9IGZyb20gJ0BjYXJkZWxsaW5pL3RzLXJlc3VsdCc7Cgp0eXBlIEpzb25PYmplY3QgPSBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjsKCmNvbnN0IG9rSWZPYmplY3QgPSAodmFsdWU6IHVua25vd24pOiBSZXN1bHQ8SnNvbk9iamVjdCwgJ0VSUl9OT1RfQU5fT0JKRUNUJz4gPT4KICB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICE9PSBudWxsICYmICFBcnJheS5pc0FycmF5KHZhbHVlKQogICAgPyBvayh2YWx1ZSBhcyBKc29uT2JqZWN0KQogICAgOiBlcnIoJ0VSUl9OT1RfQU5fT0JKRUNUJyk7Cgpjb25zdCBva0lmSW50ID0gKHZhbHVlOiB1bmtub3duKTogUmVzdWx0PG51bWJlciwgJ0VSUl9OT1RfQU5fSU5UJz4gPT4KICBOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKQogICAgPyBvayh2YWx1ZSBhcyBudW1iZXIpCiAgICA6IGVycignRVJSX05PVF9BTl9JTlQnKTsKCmNvbnN0IG9rSWZTdHJpbmcgPSAodmFsdWU6IHVua25vd24pOiBSZXN1bHQ8c3RyaW5nLCAnRVJSX05PVF9BX1NUUklORyc%2BID0%2BCiAgdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJwogICAgPyBvayh2YWx1ZSkKICAgIDogZXJyKCdFUlJfTk9UX0FfU1RSSU5HJyk7Cgpjb25zdCBva0lmTm90RW1wdHkgPSAodmFsdWU6IHN0cmluZyk6IFJlc3VsdDxzdHJpbmcsICdFUlJfRU1QVFlfU1RSSU5HJz4gPT4KICB2YWx1ZS5sZW5ndGggPiAwCiAgICA%2FIG9rKHZhbHVlKQogICAgOiBlcnIoJ0VSUl9FTVBUWV9TVFJJTkcnKTsKCmNvbnN0IG9rSWZQb3NpdGl2ZSA9ICh2YWx1ZTogbnVtYmVyKTogUmVzdWx0PG51bWJlciwgJ0VSUl9OT1RfUE9TSVRJVkUnPiA9PgogIHZhbHVlID4gMAogICAgPyBvayh2YWx1ZSkKICAgIDogZXJyKCdFUlJfTk9UX1BPU0lUSVZFJyk7Cgp0eXBlIFBlcnNvbiA9IHsKICBuYW1lOiBzdHJpbmc7CiAgYWdlOiBudW1iZXI7Cn07Cgpjb25zdCBva0lmUGVyc29uID0gKHZhbHVlOiB1bmtub3duKTogUmVzdWx0PFBlcnNvbiwgJ0VSUl9JTlZBTElEX1BFUlNPTic%2BID0%2BCiAgRG8oZnVuY3Rpb24qICgpIHsKICAgIGNvbnN0IG9iaiA9IHlpZWxkKiBva0lmT2JqZWN0KHZhbHVlKTsKICAgIGNvbnN0IG5hbWUgPSB5aWVsZCogb2tJZlN0cmluZyhvYmoubmFtZSkuY2hhaW4ob2tJZk5vdEVtcHR5KTsKICAgIGNvbnN0IGFnZSA9IHlpZWxkKiBva0lmSW50KG9iai5hZ2UpLmNoYWluKG9rSWZQb3NpdGl2ZSk7CgogICAgcmV0dXJuIHsgbmFtZSwgYWdlIH07CiAgfSkubWFwRXJyKCgpID0%2BICJFUlJfSU5WQUxJRF9QRVJTT04iKTsKCmNvbnNvbGUubG9nKG9rSWZQZXJzb24oeyBuYW1lOiAnSm9obicsIGFnZTogNDIgfSkpOwovLyBwcmludHMgT2sgeyB2YWx1ZTogeyBuYW1lOiAnSm9obicsIGFnZTogNDIgfSB9Cgpjb25zb2xlLmxvZyhva0lmUGVyc29uKHsgbmFtZTogJ0pvaG4nLCBhZ2U6IC00MiB9KSk7Ci8vIHByaW50cyBFcnIgeyBlcnJvcjogJ0VSUl9JTlZBTElEX1BFUlNPTicgfQoKY29uc29sZS5sb2cob2tJZlBlcnNvbih7IG5hbWU6ICcnLCBhZ2U6IDQyIH0pKTsKLy8gcHJpbnRzIEVyciB7IGVycm9yOiAnRVJSX0lOVkFMSURfUEVSU09OJyB9Cgpjb25zb2xlLmxvZyhva0lmUGVyc29uKHsgbmFtZTogNDIsIGFnZTogNDIgfSkpOwovLyBwcmludHMgRXJyIHsgZXJyb3I6ICdFUlJfSU5WQUxJRF9QRVJTT04nIH0KCmNvbnNvbGUubG9nKG9rSWZQZXJzb24oeyBuYW1lOiAnSm9obicgfSkpOwovLyBwcmludHMgRXJyIHsgZXJyb3I6ICdFUlJfSU5WQUxJRF9QRVJTT04nIH0KCmNvbnNvbGUubG9nKG9rSWZQZXJzb24oeyBhZ2U6IDQyIH0pKTsKLy8gcHJpbnRzIEVyciB7IGVycm9yOiAnRVJSX0lOVkFMSURfUEVSU09OJyB9Cgpjb25zb2xlLmxvZyhva0lmUGVyc29uKCcnKSk7Ci8vIHByaW50cyBFcnIgeyBlcnJvcjogJ0VSUl9JTlZBTElEX1BFUlNPTicgfQoKY29uc29sZS5sb2cob2tJZlBlcnNvbihudWxsKSk7Ci8vIHByaW50cyBFcnIgeyBlcnJvcjogJ0VSUl9JTlZBTElEX1BFUlNPTicgfQoKY29uc29sZS5sb2cob2tJZlBlcnNvbih1bmRlZmluZWQpKTsKLy8gcHJpbnRzIEVyciB7IGVycm9yOiAnRVJSX0lOVkFMSURfUEVSU09OJyB9Cg%3D%3D)

This code looks much better and more readable, doesn't it?

## `Do` Function

The `Do` function is a helper function that allows us to write code in a more
imperative style, avoiding the `chain`-hell.

The `Do` accepts a generator-function as an argument and returns a `Result`.

Full signature of `Do` is:

```typescript
type Unwrap = <T, E>(result: Result<T, E>) => Generator<E, T>;
type Job<T, E> = (unwrap: Unwrap) => Generator<E, T>;

interface Do<T, E> {
  (job: Job<T, E>): Result<OkTypeOf<T> | NotResultOf<T>, E | ErrTypeOf<T>>
}
```

To get clear how we can write code inside of the generator-function, let's look
on another case.

We need to solve the quadratic equation `ax^2 + bx + c = 0`. To solve in our
case means to find one or two real roots or indicate that there is no roots,
no real roots, or there are infinite number of roots.

```typescript
type QuadraticEqSolution = Result<
  [number] | [number, number], // or
  'NO_ROOTS' | 'INF_ROOTS' | 'NO_REAL_ROOTS' // err
>
```

It is obvious that when `a` is zero, the equation is not quadratic, but linear.
So, we can solve it first and then solve the quadratic equation.

```typescript
const linearEq = (a: number, b: number): Result<number, 'NO_ROOTS' | 'INF_ROOTS'> =>
  a !== 0 ? ok(-b / a) :
  b !== 0 ? err('NO_ROOTS') :
            err('INF_ROOTS');
```

Additionally let's define a `sqrt` function that returns a `Result`:

```typescript
const sqrt = (value: number): Result<number, 'NEGATIVE_VALUE'> =>
  value >= 0
    ? ok(Math.sqrt(value))
    : err('NEGATIVE_VALUE');
```

Now, let's solve the quadratic equation:

```typescript
const quadraticEq = (a: number, b: number, c: number): QuadraticEqSolution =>
  Do(function* () {
    if (a === 0) return linearEq(b, c).map(x => [x] as [number]);

    const sqrtD = yield* sqrt(b * b - 4 * a * c)
      .mapErr(() => 'NO_REAL_ROOTS' as const)
      ;

    const a2 = 2 * a;

    return [(-b - sqrtD) / a2, (-b + sqrtD) / a2];
  });
```

> Note: `as [number]` and `as const` are used to narrow the type of
> ok and err values. Sometimes Typescript gets the wider type than we need.

So, as we can see, inside of the generator-function we can:

- use `if` statement
- `return` a `Result` value
- unwrap a `Result` value using `yield*` and `unwrapGen` method
- map error using `mapErr` method before unwrapping with `unwrapGen` and `yield*`
- return a non-`Result` value

## `Do` is not Free

The `Do` function uses generators under the hood and `unwrap` function unwraps
the result.

So, try to write code without using `Do` if you need higher performance.

As instance, the `quadraticEq` function can be rewritten in the following way:

```typescript
const quadraticEq = (a: number, b: number, c: number): QuadraticEqSolution => {
  if (a === 0) return linearEq(b, c).map(x => [x]);

  return sqrt(b * b - 4 * a * c)
    .mapErr(() => 'NO_REAL_ROOTS' as const)
    .map((sqrtD) => {
      const a2 = 2 * a;
      return [(-b - sqrtD) / a2, (-b + sqrtD) / a2];
    });
};
```

Not too much difference, right?