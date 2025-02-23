---
title: Example Guide
description: A guide in my new Starlight docs site.
---

Useful type to model success and failure, implemented with focus on type safety,
developer experience and preserving flat learning curve.

## Usage (Synchronous)

Let's solve the quadratic equation:

[Equations Example](./examples/equations.ts)

```typescript
import { Result, err, ok, Do } from 'resultage';
import { assertNever } from 'resultage/fn';

const sqrt = (x: number): Result<number, 'ERR_NEGATIVE_NUMBER'> => (
  x < 0 ? err('ERR_NEGATIVE_NUMBER') : ok(Math.sqrt(x))
);

type LinierEquationError = 'ERR_NO_ROOTS' | 'ERR_INFINITE_ROOTS';

type QuadraticEquationError = LinierEquationError | 'ERR_NO_REAL_ROOTS';

const linierEquation =
  (a: number, b: number): Result<number, LinierEquationError> => (
    a === 0 && b === 0 ? err('ERR_INFINITE_ROOTS') :
    a === 0 ? err('ERR_NO_ROOTS') :
    ok(-b / a)
  );

type QuadraticEquationRes = Result<
  [number] | [number, number],
  QuadraticEquationError
>;

const quadraticEquation = (a: number, b: number, c: number): QuadraticEquationRes =>
  Do(function* (unwrap) {
    if (a === 0) {
      return linierEquation(b, c).map((x) => [x] as [number]);
    }

    const d = yield* unwrap(
      sqrt(b * b - 4 * a * c).mapErr(() => 'ERR_NO_REAL_ROOTS'),
    );

    const a2 = 2 * a;

    return [(-b + d) / a2, (-b - d) / a2];
  });

const result = quadraticEquation(0, 0, 0);

if (result.isOk()) {
  console.log(result.unwrap());
} else {
  const errorCode = result.unwrapErr();

  switch (errorCode) {
  case 'ERR_NO_REAL_ROOTS':
    console.log('No real roots');
    break;
  case 'ERR_NO_ROOTS':
    console.log('No roots');
    break;
  case 'ERR_INFINITE_ROOTS':
    console.log('Infinite roots');
    break;
  default:
    assertNever(errorCode, `Unexpected error code: ${errorCode as string}`);
  }
}
```

## Usage (Asynchronous)

Let's extend a book with its authors:

[Book And Authors Example](./examples/book-and-authors.ts)

```typescript
import { Result, asyncDo, expectExists, fold, okIfExists } from 'resultage';

type Book = { id: string; title: string; authorIds: string[] };
type Person = { id: string; name: string; };

type GetBookWithAuthorsRes = Result<
  Book & { authors: Person[] },
  'ERR_BOOK_NOT_FOUND' | 'ERR_PERSON_NOT_FOUND'
>

const getBookWithAuthors = (bookId: string): Promise<GetBookWithAuthorsRes> =>
  asyncDo(async function* (_) {
    const book = yield* _(fetchBook(bookId).then(
      expectExists('ERR_BOOK_NOT_FOUND')
    ));

    const persons = await fetchPersons(book.authorIds);

    const authors = yield* _(fold(
      persons.map(person => okIfExists(person, 'ERR_PERSON_NOT_FOUND'))
    ));

    return { ...book, authors };
  });

// emulating an api call
const fetchBook = async (id: string): Promise<Book | null> => (
  id === '1' ? { id, title: 'The Lord of the Rings', authorIds: ['1', '2'] } :
  id === '2' ? { id, title: 'The Silmarillion', authorIds: ['1', '3'] } :
  null
);

// emulating a bulk fetch to avoid N+1 queries
const fetchPersons = async (ids: string[]): Promise<(Person | null)[]> =>
  ids.map(id => (
    id === '1' ? { id, name: 'J. R. R. Tolkien' } :
    id === '2' ? { id, name: 'Christopher Tolkien' } :
    null
  ));

async function run() {
  const LordOfTheRings = await getBookWithAuthors('1');
  console.log(LordOfTheRings.unwrap());
  // Prints to console book with authors populated

  const Silmarillion = await getBookWithAuthors('2');
  console.log(Silmarillion.unwrapErr());
  // Prints to console: ERR_PERSON_NOT_FOUND

  const TheHobbit = await getBookWithAuthors('3');
  console.log(TheHobbit.unwrapErr());
  // Prints to console: ERR_BOOK_NOT_FOUND
}

run().catch(console.error);
```

## Installation

```bash
npm install result-ts
```

## `interface Result<T, E>`

`Result<T, E>` is an interface that defines several methods and is implemented
by two classes `Ok<T>` and `Err<E>`, where the type parameters are:

- `T` - the type of the value that is returned in case of success
- `E` - the type of the value that is returned in case of failure

The interface declaration is as follows (see [src/types.ts](./src/types.ts#L5)):

```typescript
export interface Result<T, E> {
  isOk(): this is Ok<T>;
  isErr(): this is Err<E>;
  map<S>(fn: (data: T) => S): Result<S, E>;
  mapErr<F>(fn: (error: E) => F): Result<T, F>;
  chain<S, F>(next: (data: T) => Result<S, F>): Result<S, F | E>;
  chainErr<S, F>(next: (error: E) => Result<S, F>): Result<T | S, F>;
  unwrap(): T;
  unwrapOr<S>(fallback: S): T | S;
  unwrapOrElse<S>(fallback: (error: E) => S): T | S;
  unwrapErr(): E;
  unwrapErrOr<F>(fallback: F): E | F;
  unwrapErrOrElse<F>(fallback: (data: T) => F): E | F;
  unpack(): T | E;
  match<ER, TR>(
    okMatcher: (data: T) => TR,
    errMatcher: (error: E) => ER,
  ): ER | TR;
  tap(fn: (data: T) => void): Result<T, E>;
  tapErr(fn: (error: E) => void): Result<T, E>;
}
```

The interface is implemented by two classes:

- `Ok<T>` implements `Result<T, never>` and represents a successful result
- `Err<E>` implements `Result<never, E>` and represents a failed result

## Creating Result Values

The value of type `Result<T, E>` could be created with the factory functions:

```typescript
import { ok, err } from 'resultage';

const okResult = ok(42); // Result<number, never>
const errResult = err('ERR_NOT_FOUND' as const); // Result<never, 'ERR_NOT_FOUND'>
```

## Methods of `Result<T, E>` Instances

### `isOk(): this is Ok<T>`

Returns `true` if the result is `Ok<T>`

```typescript
import { ok, err } from 'resultage';

const okResult = ok(42);
const errResult = err('ERR_NOT_FOUND' as const);

okResult.isOk(); // true
errResult.isOk(); // false
```

### `isErr(): this is Err<E>`

Returns `true` if the result is `Err<E>`

```typescript
import { ok, err } from 'resultage';

const okResult = ok(42);
const errResult = err('ERR_NOT_FOUND' as const);

okResult.isErr(); // false
errResult.isErr(); // true
```






### `unpack(): T | E`

Returns the value of `Ok<T>` or `Err<E>`.

```typescript
import { Equal, Expect } from '@type-challenges/utils';
import { Result, ok, err } from 'resultage';

const okResult: Result<number, 'NOT_FOUND'> = ok(42);
const errResult: Result<string, 'ERR_NOT_FOUND'> = err('ERR_NOT_FOUND');

const value = okResult.unpack(); // 42
const error = errResult.unpack(); // 'ERR_NOT_FOUND'

const checkValue: Expect<Equal<
  typeof value,
  number | 'NOT_FOUND'
>> = true;

const checkError: Expect<Equal<
  typeof error,
  string | 'ERR_NOT_FOUND'
>> = true;

const okValue = ok(42).unpack();
const checkOk: Expect<Equal<
  typeof okValue,
  number
>> = true;

const errValue = err('ERR_NOT_FOUND' as const).unpack();
const checkErr: Expect<Equal<
  typeof errValue,
  'ERR_NOT_FOUND'
>> = true;
```

### `match<ER, TR>(okMatcher: (data: T) => TR, errMatcher: (error: E) => ER): ER | TR`

Returns the result of `okMatcher` if the result is `Ok<T>` or the result of
`errMatcher` if the result is `Err<E>`.

```typescript
import { ok, err } from 'resultage';

const okResult = ok(42);
const errResult = err('ERR_NOT_FOUND' as const);

okResult.match(
  (x) => `Value is ${x}`,
  () => 'Some error',
); // 'Value is 42'

errResult.match(
  () => 'Some value',
  (e) => `Error is ${e}`,
); // 'Error is ERR_NOT_FOUND'
```

### `tap(fn: (data: T) => void): Result<T, E>`

Executes `fn` if the result is `Ok<T>` and returns the result as is. If the
result is `Err<E>` then `fn` is not executed and the result is returned as is.

```typescript
import { ok, err } from 'resultage';

const okResult = ok(42);
const errResult = err('ERR_NOT_FOUND' as const);

okResult.tap((x) => console.log(`Value is ${x}`)); // Ok(42)
// printed to console: Value is 42

errResult.tap((x) => console.log(`Value is ${x}`)); // Err('ERR_NOT_FOUND')
// nothing is printed to console
```

### `tapErr(fn: (error: E) => void): Result<T, E>`

Executes `fn` if the result is `Err<E>` and returns the result as is. If the
result is `Ok<T>` then `fn` is not executed and the result is returned as is.

```typescript
import { ok, err } from 'resultage';

const okResult = ok(42);
const errResult = err('ERR_NOT_FOUND' as const);

okResult.tapErr((e) => console.log(`Error is ${e}`)); // Ok(42)
// nothing is printed to console

errResult.tapErr((e) => console.log(`Error is ${e}`)); // Err('ERR_NOT_FOUND')
// printed to console: Error is ERR_NOT_FOUND
```

## Type Guards

The `result-ts` library exports the following type guards:

- `isResult(value: unknown): value is Result<unknown, unknown>` - returns `true`
  if the `value` is an instance of `Result<T, E>`

- `isOk<T>(value: Result<T, unknown>): value is Ok<T>` - returns `true` if the
  `value` is an instance of `Ok<T>`

- `isErr<E>(value: Result<unknown, E>): value is Err<E>` - returns `true` if the
  `value` is an instance of `Err<E>`

## Conditional Construction

The `result-ts` library exports the following functions to construct `Result<T, E>`
depending on the condition:

- `okIf` - accepts value, condition and fallback. Returns `Ok<T>` if the
  condition is `true` or `Err<E>` if the condition is `false`
- `expect` - accepts condition, fallback and returns functions that accepts the
  value and returns `Ok<T>` if the condition is `true` or `Err<E>` if the
  condition is `false`
- `okIfExists` - accepts value and fallback. Returns `Ok<T>` if the value is
  not `undefined` or `null`, and returns `Err<E>` otherwise
- `expectExists` - accepts fallback and returns functions that accepts the
  value and returns `Ok<T>` if the value is not `undefined` or `null`, and
  returns `Err<E>` otherwise

### `okIf`

The function has two overloads:

```typescript
export const okIf: {
  <T, S extends T, F>(
    value: T,
    guard: (data: T) => data is S,
    fallback: F | ((value: Exclude<T, S>) => F)
  ): Result<S, F>;
  <T, F>(
    value: T,
    predicate: (data: T) => boolean,
    fallback: F | ((value: T) => F)
  ): Result<T, F>;
}
```

Example:

```typescript
import { okIf } from 'resultage';

const isNumber = (x: unknown): x is number => typeof x === 'number';
const isPositive = (x: number) => x > 0;

const okIfNumber = (value: unknown) => okIf(
  value,
  isNumber,
  'ERR_NOT_A_NUMBER' as const,
);

const okIfPositive = (value: number) => okIf(
  value,
  isPositive,
  'ERR_NOT_POSITIVE' as const,
);

console.log(okIfNumber(42).chain(okIfPositive));
// prints to console:
// Ok { value: 42 }

console.log(okIfNumber('42').chain(okIfPositive));
// prints to console:
// Err { error: 'ERR_NOT_A_NUMBER' }

console.log(okIfNumber(-42).chain(okIfPositive));
// prints to console:
// Err { error: 'ERR_NOT_POSITIVE' }
```

### `expect`

The function has two overloads:

```typescript
export const expect: {
  <T, S extends T, F>(
    guard: (data: T) => data is S,
    fallback: F | ((value: Exclude<T, S>) => F)
  ): (value: T) => Result<S, F>;
  <T, F>(
    predicate: (data: T) => boolean,
    fallback: F | ((value: T) => F)
  ): (value: T) => Result<T, F>;
}
```

Example:

```typescript
import { expect } from 'resultage';

type CodedError<C extends string, P> = { code: C; payload?: P };

const codedError = <C extends string, P = undefined>(
  code: C, payload?: P,
): CodedError<C, P> => (payload === undefined ? { code } : { code, payload });

const expectNumber = expect(
  (x: unknown): x is number => typeof x === 'number',
  (value) => codedError('ERR_NOT_A_NUMBER', value),
);

const expectPositive = expect(
  (x: number) => x > 0,
  (x) => codedError('ERR_NOT_POSITIVE', { value: x }),
);

const expectPositiveNumber = (value: unknown) =>
  expectNumber(value).chain(expectPositive);

console.log(expectPositiveNumber(42));
// prints to console:
// Ok { value: 42 }

console.log(expectPositiveNumber('42'));
// prints to console:
// Err { error: { code: 'ERR_NOT_A_NUMBER', payload: '42' } }

console.log(expectPositiveNumber(-42));
// prints to console:
// Err { error: { code: 'ERR_NOT_POSITIVE', payload: { value: -42 } } }
```

### `okIfExists`

The function signature is as follows:

```typescript
const okIfExists<T, E>: (
  value: T | undefined | null,
  fallback: E | ((value: undefined | null) => E)
) => Result<T, E>;
```

Example:

```typescript
import { okIfExists } from 'resultage';

const positiveNumber = okIfExists(
  [1, 2, 3, -1, 4].find((x) => x > 0),
  'ERR_NOT_FOUND' as const
).unwrap(); // 1

const name = okIfExists(
  [null, 'Name'].find((x) => x !== null),
  'ERR_NOT_FOUND' as const
).unwrap(); // Name

console.log(okIfExists(undefined, 'ERR_NOT_FOUND' as const));
// prints to console:
// Err { error: 'ERR_NOT_FOUND' }

console.log(okIfExists(null, 'ERR_NOT_FOUND' as const));
// prints to console:
// Err { error: 'ERR_NOT_FOUND' }
```

### `expectExists`

The function signature is as follows:

```typescript
const expectExists<T, E>: (
  fallback: E | ((value: undefined | null) => E)
) => (value: T | undefined | null) => Result<T, E>;
```

Example:

```typescript
import { Equal, Expect } from '@type-challenges/utils';
import { AsyncResult, expectExists } from 'resultage';

type User = { login: string; name: string };

const fetchUser = (login: string) =>
  fetch(`/api/users/${login}`)
    .then((res) => res.json())
    .then(({ data }) => data as User)
    .then(expectExists({
        code: 'ERR_USER_NOT_FOUND' as const,
        message: `User with login "${login}" not found`,
      }));

const checkFetchUser: Expect<Equal<
  typeof fetchUser,
  (login: string) => AsyncResult< // the same as Promise<Result<
    User,
    { code: 'ERR_USER_NOT_FOUND'; message: string; }
  >
>> = true;
```

## List Operations

The `result-ts` library provides the following functions to work with lists of
`Result<T, E>` values:

- `firstOk(results: Result<T, E>[]): Result<T, E>` - returns the first `Ok<T>`
  result or the last `Err<E>` result
- `lastOk(results: Result<T, E>[]): Result<T, E>` - returns the last `Ok<T>`
  result or the first `Err<E>` result
- `reduce <T, S, E>(results: Result<T, E>[], reducer: (acc: S, result: T) => S, initial: S): Result<S, E>` - reduces the list of `Ok<T>` results to a single `Ok<S>` result or returns the first `Err<E>` result
- `fold(results: Result<T, E>[]): Result<T[], E>` - folds the list of `Ok<T>`
  results to a single `Ok<T[]>` result or returns the first `Err<E>` result

## Do Notation

The `Do` Notation has an origin in Haskell where it is a syntactic sugar for
monadic code. In `result-ts` it is a way to write imperative code similar to
`async/await` syntax.

`result-ts` provides two function to work with `Result` values:

- `Do` - for synchronous code
- `asyncDo` - for asynchronous code

The `Do` function is based on the generator, when the `asyncDo` function is
based on the async generator.

In general approach exploiting the opportunity to implicitly exit from the
co-routine (generator function) with `yield` operator called inside of the
nested generator.

Type safety is achieved by using the `unwrap` generator function to return
the value of `Ok<T>` result and yield the value ok `Err<E>` result.

For convenience, the `unwrap` generator is passed as an argument to
the generator function that is an argument of `Do` or `asyncDo` functions.

### `Do`

The `Do` function is used to write imperative code similar to `async/await`,
but for synchronous code when we deal with type `Result<T, E>`.

Typing:

```typescript
type Unwrap = {
  <T, E>(result: Result<T, E>): Generator<Result<never, E>, T>;
};

type Job<out T, out S, out E> = (unpack: Unwrap) => Generator<
  Result<S, E>, T | Result<S, E>
>;

function Do<T, S, E>(job: Job<T, S, E>): Result<T | S, E>;
```

Where the type parameters are:

- `T` - the type of the value that is returned in case of success without to be
  explicitly wrapped in `Ok<T>`
- `S` - the type of the value that is returned in case of success wrapped in
  `Ok<S>`
- `E` - the type of the value that is returned in case of failure wrapped in
  `Err<E>`

```typescript
const div = (a: number, b: number): Result<number, 'ERR_DIV_BY_ZERO'> => (
  b === 0
    ? err('ERR_DIV_BY_ZERO')
    : ok(a / b)
);

const sqrt = (x: number): Result<number, 'ERR_NEGATIVE'> => (
  x < 0
    ? err('ERR_NEGATIVE')
    : ok(Math.sqrt(x))
);

const quadraticEquation = (a: number, b: number, c: number): Result<
  { x1: number; x2: number },
  'ERR_NEGATIVE' | 'ERR_DIV_BY_ZERO'
> => Do(function* (unwrap) {
  const d = yield* unwrap(
    sqrt(b * b - 4 * a * c),
  );

  const reverseA2 = yield* unwrap(
    div(1, a * 2),
  );

  return {
    x1: (-b + d) * reverseA2,
    x2: (-b - d) * reverseA2,
  };
});

console.log(quadraticEquation(1, 2, 3));
// Err { error: 'ERR_NEGATIVE' }
console.log(quadraticEquation(0, 2, -3));
// Err { error: 'ERR_DIV_BY_ZERO' }
console.log(quadraticEquation(1, -3, 2));
// Ok { value: { x1: 2, x2: 1 } }
```

To make code a little bit more concise the argument of Job-function could be named
as `_` instead of `unwrap`:

```typescript
const quadraticEquation = (a: number, b: number, c: number): Result<
  { x1: number; x2: number },
  'ERR_NEGATIVE' | 'ERR_DIV_BY_ZERO'
> => Do(function* (_) {
  const d = yield* _(sqrt(b * b - 4 * a * c));
  const reverseA2 = yield* _(div(1, a * 2));

  return {
    x1: (-b + d) * reverseA2,
    x2: (-b - d) * reverseA2,
  };
});
```

### `asyncDo`

The `asyncDo` function is used to write imperative code similar to `async/await`
when we deal with asynchronous code and types like: `Promise<Result<T, E>>`.

For convenience, `result-ts` defines the following types:

```typescript
type MaybeAsync<T> = T | Promise<T>;
type AsyncResult<T, E> = Promise<Result<T, E>>;
type MaybeAsyncResult<T, E> = MaybeAsync<Result<T, E>>;
```

Typing:

```typescript
type AsyncUnwrap = <T, S, E>(
  result: MaybeAsync<Result<T, E>>,
) => AsyncGenerator<Result<S, E>, T>;

type AsyncJob<out T, out S, out E> = (unwrap: AsyncUnwrap) => AsyncGenerator<
  Result<S, E>,
  T | Result<S, E>
>;

function asyncDo<T, S, E>(job: AsyncJob<T, S, E>): Promise<Result<T | S, E>>;
```

Where the type parameters are:

- `T` - the type of the value that is returned in case of success without to be
  explicitly wrapped in `Ok<T>`
- `S` - the type of the value that is returned in case of success wrapped in
  `Ok<S>`
- `E` - the type of the value that is returned in case of failure wrapped in `Err<E>`

## Functor and Monad Laws

The `Result<T, E>` is implement with respect to the functor and monad laws from
the category theory point of view.

The `Result<T, E>` doesn't implement any of well-known ADT-frameworks like
`fp-ts`, `effect` or `fantasy-land`.

The compatibility with mentioned frameworks is not assumed to be provided in
the future.

## Support For Point-Free Style

In order to support the Point-Free programming style the `result-ts` library
exports the functions that are the carried wrappers for the methods of `Result<T, E>`
with `self` as the second argument.

- `map`
- `mapErr`
- `chain`
- `chainErr`
- `tap`
- `tapErr`
- `unwrap`
- `unwrapOr`
- `unwrapOrElse`
- `unwrapErr`
- `unwrapErrOr`
- `unwrapErrOrElse`
- `unpack`
- `match`
- `tap`
- `tapErr`

Example:

```typescript
import { Result, err, ok, map, mapErr } from 'resultage';
import { asConst, assertNever, pipe } from 'resultage/fn';

const sqrt = (x: number): Result<number, 'ERR_NEGATIVE_NUMBER'> => (
  x < 0
    ? err('ERR_NEGATIVE_NUMBER')
    : ok(Math.sqrt(x))
);

type LinierEquationError =
  | 'ERR_NO_ROOTS'
  | 'ERR_INFINITE_ROOTS';

type QuadraticEquationError =
  | LinierEquationError
  | 'ERR_NO_REAL_ROOTS';

const linierEquation =
  (a: number, b: number): Result<number, LinierEquationError> => (
    a === 0 && b === 0 ? err('ERR_INFINITE_ROOTS') :
    a === 0 ? err('ERR_NO_ROOTS') :
    ok(-b / a)
  );

type QuadraticEquationResult = Result<
  [number] | [number, number], // roots
  QuadraticEquationError
>;

const singleRoot = (x: number): [number] => [x];

const twoRoots = (a2: number, b: number) => (d: number): [number, number] => [
  (-b + d) / a2,
  (-b - d) / a2,
];

const quadraticEquation = (a: number, b: number, c: number): QuadraticEquationResult =>
  (a === 0
    ? pipe(
      linierEquation(b, c),
      map(singleRoot),
    )
    : pipe(
      sqrt(b * b - 4 * a * c),
      mapErr(asConst('ERR_NO_REAL_ROOTS')),
      map(twoRoots(a * 2, b)),
    )
  );

const result = quadraticEquation(0, 0, 0);

if (result.isOk()) {
  console.log(result.unwrap());
} else {
  const errorCode = result.unwrapErr();

  switch (errorCode) {
  case 'ERR_NO_REAL_ROOTS':
    console.log('No real roots');
    break;
  case 'ERR_NO_ROOTS':
    console.log('No roots');
    break;
  case 'ERR_INFINITE_ROOTS':
    console.log('Infinite roots');
    break;
  default:
    assertNever(errorCode, `Unexpected error code: ${errorCode as string}`);
  }
}
```

### Support for Promise<Result<T, E>>

The `result-ts` library exports the functions that are similar to carried
methods of the `Result<T, E>` but for `Promise<Result<T, E>>`:

- `thenMap`
- `thenMapErr`
- `thenChain`
- `thenChainErr`
- `thenUnwrap`
- `thenUnwrapOr`
- `thenUnwrapOrElse`
- `thenUnwrapOrReject`
- `thenUnwrapErr`
- `thenUnwrapErrOr`
- `thenUnwrapErrOrElse`
- `thenUnpack`
- `thenMatch`
- `thenTap`
- `thenTapAndWait`
- `thenTapErr`
- `thenTapErrAndWait`
