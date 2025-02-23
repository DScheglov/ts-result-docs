---
title: Collecting OK's
order: 5
---

```typescript
import { Result, ok, err, collect } from "resultage";

const parseInteger = (input: string): Result<number, "ERR_NOT_AN_INT"> => {
  const parsed = +input;
  return Number.isInteger(parsed) ? ok(parsed) : err("ERR_NOT_AN_INT");
}

console.log(
  collect(
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].map(parseInteger)
  )
);
// Prints: Ok { value: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"] }

console.log(
  collect(
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10.1"].map(parseInteger)
  )
);
// Prints: Err { error: "ERR_NOT_AN_INT" }
```
