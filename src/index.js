const { runHookApp } = require('@forrestjs/hooks');
const { Q1 } = require('./contants');

// Services
const serviceFastify = require('./service/service-fastify');
const serviceFastifyCors = require('./service/service-fastify-cors');
const serviceFetchq = require('./service/service-fetchq');
const serviceFastifyFetchq = require('./service/service-fastify-fetchq');
const serviceTdd = require('./service/service-tdd');

// Features
const featurePing = require('./feature/ping');
const featureApiV1 = require('./feature/api-v1');

// Settings
const settings = ({ setConfig }) => {
  // FetchQ Maintenance
  setConfig('fetchq.pool.max', 1);
  setConfig('fetchq.maintenance', {
    limit: 1,
    delay: 100,
    sleep: 1000,
  });
  setConfig('fetchq.queues', [
    {
      name: Q1,
      isActive: true,
      enableNotifications: true,
      maxAttempts: 5,
      errorsRetention: '1h',
      maintenance: {
        mnt: { delay: '3s', duration: '5m', limit: 500 },
        sts: { delay: '1m', duration: '5m' },
        cmp: { delay: '30m', duration: '5m' },
        drp: { delay: '10m', duration: '5m' },
      },
    },
  ]);

  // Generica app configuration
  setConfig('app.q1', Q1);
};

runHookApp({
  settings,
  trace: 'compact',
  services: [
    serviceFetchq,
    serviceFastify,
    serviceFastifyCors,
    serviceFastifyFetchq,
    serviceTdd,
  ],
  features: [featurePing, featureApiV1],
}).catch(err => console.error(err.message));
