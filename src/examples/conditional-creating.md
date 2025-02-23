---
title: Conditional Result Creation
order: 2
---

```typescript
import { okIf, okIfExists } from 'resultage';

const isInt = (value: unknown): value is number => Number.isInteger(value);

const okIfInt = (value: unknown) => okIf(value, isInt, "ERR_NOT_AN_INT" as const);

const result = okIfInt(42);
console.log(result);
// prints: Ok { value: 42 }

const findGreaterThen2 = (numbers: number[]) =>
  okIfExists(
    numbers.find((x) => x > 2),
    "ERR_NOT_FOUND_GT_2" as const
  );

const result2 = findGreaterThen2([1, 2, 3, 4]);
console.log(result2);
// prints: Ok { value: 3 }

const result3 = findGreaterThen2([1, 2]);
console.log(result3);
// prints: Err { error: 'ERR_NOT_FOUND_GT_2' }
```
