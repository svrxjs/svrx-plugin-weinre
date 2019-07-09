const ffp = require('find-free-port');
const weinre = require('./weinre/lib/weinre');

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
  assets: {
    script: config => {
      const boundHost = config.get('boundHost');
      const httpPort = config.get('httpPort');
      return `
        (function () {
          var script = document.createElement('script');
          script.src = 'http://${boundHost}:${httpPort}/target/target-script-min.js#anonymous';
          document.body.appendChild(script);
        })();
      `;
    }
  },
  hooks: {
    async onCreate({ config }) {
      const [ vaildPort ] = await ffp(config.get('$.port') + 1);
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

      const server = weinre.run(opts);
      await new Promise((resolve) => {
        server.on('listening', () => {
          resolve();
        });
      });

      return () => {
        server.close();
      }
    }
  }
};