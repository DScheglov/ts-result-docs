---
title: Collecting OK's with `Do`
order: 7
---

```typescript
import { Result, ok, err, Do } from "resultage";

const parseInteger = (input: string): Result<number, "ERR_NOT_AN_INT"> => {
  const parsed = +input;
  return Number.isInteger(parsed) ? ok(parsed) : err("ERR_NOT_AN_INT");
}

const strings = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const parsedIntegers = strings.map(parseInteger);

const result = Do(function* () {
  const integers: number[] = [];

  for (const int of parsedIntegers) integers.push(yield* int);

  return integers;
});

console.log(result);
// Prints: Ok { value: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
```
