const libPath = require('path');
const libFs = require('fs');
const portfinder = require('portfinder');
const weinre = require('./weinre/lib/weinre');

function isHtml(url) {
  return /\.(html|htm)($|\?)/.test(url);
}

function appendScript(body, scriptUrl) {
  const replaceScript = [`</body>`, `<script async src="${scriptUrl}"></script></body>`];
  return body.replace(...replaceScript);
}

module.exports = {
  configSchema: {
    httpPort: {
      type: 'number'
    },
    boundHost: {
      type: 'string',
      default: 'localhost'
    },
    verbose: {
      type: 'boolean',
      default: false
    },
    debug: {
      type: 'boolean',
      default: false
    },
    readTimeout: {
      type: 'number',
      default: 5
    },
    deathTimeout: {
      type: 'number',
      default: 15
    }
  },
  hooks: {
    async onCreate({ config }) {
      const vaildPort = await portfinder.getPortPromise();
      const httpPort = config.get('httpPort') || vaildPort;
      config.set('httpPort', httpPort);

      const opts = {
        httpPort,
        boundHost: config.get('boundHost'),
        verbose: config.get('verbose'),
        debug: config.get('debug'),
        readTimeout: config.get('readTimeout'),
        deathTimeout: config.get('deathTimeout')
      };

      const stopWeinre = await weinre.run(opts);
      
      return () => {
        stopWeinre();
      };
    },
    async onRoute(ctx, next, { config }) {
      if (isHtml(ctx.path)) {
        const rootPath = config.get('$.root');
        const boundHost = config.get('boundHost');
        const httpPort = config.get('httpPort');
        const filePath = libPath.join(rootPath, ctx.path);
        const fileContent = libFs.readFileSync(filePath, 'utf8');
        const scriptUrl = `http://${boundHost}:${httpPort}/target/target-script-min.js#anonymous`;
        ctx.body = appendScript(fileContent, scriptUrl);
      }

      await next();
    }
  }
};