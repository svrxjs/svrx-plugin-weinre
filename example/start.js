const path = require('path');
const { existsSync } = require('fs');

const svrxCLI = path.resolve(require('global-modules'), '@svrx', 'cli', 'lib');

if (!existsSync(svrxCLI)) {
  console.log('Please install svrx-cli by `npm i @svrx/cli -g`');
  process.exit();
}

const Manager = require(svrxCLI);

process.chdir(__dirname);

const manager = new Manager();
manager.loadConfigFile();
Manager.loadSvrx({}, {
  root: __dirname,
  plugins: [{ path: path.resolve('..') }],
}).then((svrx) => {
  svrx.start();
});
