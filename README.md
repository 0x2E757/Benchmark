# Benchmark

Library for code performance testing using Node.js

## Installation

```bash
npm i @0x2e757/benchmark
```

## Usage example

If used in JavaScript import as:
```javascript
const benchmark = require("@0x2e757/benchmark");
```

If used in TypeScript import as:
```typescript
import * as benchmark from "@0x2e757/benchmark";
```

Benchmark your code:
```javascript
benchmark.test({

    "case 1": () => {
        // Some code
    },

    "case 2": () => {
        // Another code
    },

});
```