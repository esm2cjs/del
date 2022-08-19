# @esm2cjs/del

This is a fork of https://github.com/sindresorhus/del, but automatically patched to support ESM **and** CommonJS, unlike the original repository.

## Install

You can use an npm alias to install this package under the original name:

```
npm i del@npm:@esm2cjs/del
```

```jsonc
// package.json
"dependencies": {
    "del": "npm:@esm2cjs/del"
}
```

but `npm` might dedupe this incorrectly when other packages depend on the replaced package. If you can, prefer using the scoped package directly:

```
npm i @esm2cjs/del
```

```jsonc
// package.json
"dependencies": {
    "@esm2cjs/del": "^ver.si.on"
}
```

## Usage

```js
// Using ESM import syntax
import { deleteAsync } from "@esm2cjs/del";

// Using CommonJS require()
const { deleteAsync } = require("@esm2cjs/del");
```

For more details, please see the original [repository](https://github.com/sindresorhus/del).

## Sponsoring

To support my efforts in maintaining the ESM/CommonJS hybrid, please sponsor [here](https://github.com/sponsors/AlCalzone).

To support the original author of the module, please sponsor [here](https://github.com/sindresorhus/del).
