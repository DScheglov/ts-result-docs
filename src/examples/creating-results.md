---
title: Creating Results
order: 1
---

```typescript
import { ok, err } from '@cardellini/ts-result';

const okResult = ok(42);
const errResult = err('ERR_NOT_FOUND' as const);

console.log(okResult);
// prints: Ok { value: 42 }

console.log(errResult);
// prints: Err { error: 'ERR_NOT_FOUND' }
```
