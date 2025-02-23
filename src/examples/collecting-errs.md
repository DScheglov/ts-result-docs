---
title: Collecting Err's
order: 6
---

```typescript
import { Result, ok, err, collectErr } from "resultage";

const parseInteger = (input: string): Result<number, "ERR_NOT_AN_INT"> => {
  const parsed = +input;
  return Number.isInteger(parsed) ? ok(parsed) : err("ERR_NOT_AN_INT");
}

const parsedInts = ["1.2", "_", "3$", "abra", "10.1"].map(
  (str, index) => parseInteger(str).mapErr(
    code => ({ code, index })
  )
);

const errResult = collectErr(parsedInts);
console.log(errResult);
// Prints Err { error: [{ code: "ERR_NOT_AN_INT", index: 0 }, ... ] }
```
