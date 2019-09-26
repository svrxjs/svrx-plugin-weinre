svrx-plugin-weinre
---

[![svrx](https://img.shields.io/badge/svrx-plugin-%23ff69b4?style=flat-square)](https://svrx.io/)
[![npm](https://img.shields.io/npm/v/svrx-plugin-weinre.svg?style=flat-square)](https://www.npmjs.com/package/svrx-plugin-weinre)

The svrx plugin for weinre

## Usage

> Please make sure that you have installed [svrx](https://svrx.io/) already.

### Via CLI

```bash
svrx -p weinre
```

### Via API

```js
const svrx = require('@svrx/svrx');

svrx({ plugins: [ 'weinre' ] }).start();
```

## Options

| Arguments | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| httpPort | number |  | server port |
| boundHost | string | localhost | server domain |
| verbose | boolean | false | output the running log |
| debug | boolean | false | output the debugger log |
| readTimeout | number | 5 | timeout from server to client |
| deathTimeout | number | 15 | disconnect timeout |

## License

MIT