const ffp = require('find-free-port');
const os = require('os');
const weinre = require('./weinre/lib/weinre');
const utils = require('./weinre/lib/utils');

function getExternalIp() {
  const ifaces = os.networkInterfaces();
  const ips = [];

  Object.keys(ifaces).forEach((dev) => {
    ifaces[dev].forEach((details) => {
      if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
        ips.push(details.address);
      }
    });
  });
  return ips.length > 0 ? ips[0] : 'localhost';
}

module.exports = {
  configSchema: {
    httpPort: {
      type: 'number',
    },
    boundHost: {
      type: 'string',
      default: getExternalIp(),
    },
    verbose: {
      type: 'boolean',
      default: false,
    },
    debug: {
      type: 'boolean',
      default: false,
    },
    readTimeout: {
      type: 'number',
      default: 5,
    },
    deathTimeout: {
      type: 'number',
      default: 15,
    },
  },
  assets: {
    script: (config) => {
      const boundHost = config.get('boundHost');
      const httpPort = config.get('httpPort');
      return `
        (function () {
          var script = document.createElement('script');
          script.src = 'http://${boundHost}:${httpPort}/target/target-script-min.js#anonymous';
          document.body.appendChild(script);
        })();
      `;
    },
  },
  hooks: {
    async onCreate({ config, logger, events }) {
      utils.log = (message) => {
        logger.debug(message);
      };

      utils.notify = (message) => {
        logger.notify(message);
      };

      events.on('ready', async () => {
        const [vaildPort] = await ffp(config.get('$.port'));
        const httpPort = config.get('httpPort') || vaildPort;
        config.set('httpPort', httpPort);

        const opts = {
          httpPort,
          boundHost: config.get('boundHost'),
          verbose: config.get('verbose'),
          debug: config.get('debug'),
          readTimeout: config.get('readTimeout'),
          deathTimeout: config.get('deathTimeout'),
        };

        weinre.run(opts);
      });
    },
  },
};
