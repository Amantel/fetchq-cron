const envalid = require('envalid');
const BACKEND_ROOT = process.env.SERVER_ROOT || process.env.SANDBOX_URL;

module.exports = () =>
  envalid.cleanEnv(process.env, {
    TEST_SERVER_ROOT: envalid.url({
      default: BACKEND_ROOT,
    }),
    TEST_STATUS_CHECK_URL: envalid.url({
      default: `${BACKEND_ROOT}/test/status`,
    }),
    TEST_STATUS_CHECK_INTERVAL: envalid.num({ default: 250 }),
  });
