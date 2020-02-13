const axios = require('axios');

describe('v1/cron', () => {
  const { TEST_SERVER_ROOT } = global.env;
  const t1 = {
    group_name: 'foo',
    task_name: 't1',
    action: {
      method: 'webhook',
      endpoint: `${TEST_SERVER_ROOT}/test/w1`,
      auth: {
        method: 'none',
      },
    },
    schedule: {
      method: 'delay',
      value: '+1s',
    },
    payload: {},
  };

  // CLEANUP
  beforeEach(() => axios.get(`${TEST_SERVER_ROOT}/test/schema-v1/reset`));
  // afterAll(() => axios.get(`${TEST_SERVER_ROOT}/test/schema-v1/reset`));

  describe('upsert', () => {
    it('should upsert a new task with a delay', async () => {
      const r1 = await axios.post(`${TEST_SERVER_ROOT}/api/v1/cron/`, t1);
      // console.info(r1.data);
      expect(r1.data.success).toBe(true);
      expect(r1.data.data.was_created).toBe(true);

      // Assert on the delay
      const ni = new Date(r1.data.data.next_iteration);
      const ct = new Date(r1.data.data.created_at);
      expect(ni - ct).toBeLessThanOrEqual(1000);
    });

    it('should upsert a new task with a cron plan', async () => {
      const r1 = await axios.post(`${TEST_SERVER_ROOT}/api/v1/cron/`, {
        ...t1,
        schedule: {
          method: 'plan',
          value: '2012-12-26 12:00:00',
        },
      });
      // console.info(r1.data);
      expect(r1.data.success).toBe(true);
      expect(r1.data.data.was_created).toBe(true);
      expect(r1.data.data.next_iteration).toBe('2012-12-26T12:00:00.000Z');
    });

    it('should upsert a existing task', async () => {
      await axios.post(`${TEST_SERVER_ROOT}/api/v1/cron/`, t1);
      const res = await axios.post(`${TEST_SERVER_ROOT}/api/v1/cron/`, t1);
      // console.info(res.data);
      expect(res.data.success).toBe(true);
      expect(res.data.data.was_created).toBe(false);
    });
  });

  describe('list', () => {
    const t2 = { ...t1, task_name: 't2' };
    const t3 = { ...t1, task_name: 't3' };
    const t4 = { ...t1, task_name: 't4', group_name: 'faa' };
    const t5 = { ...t1, task_name: 't5', group_name: 'faa' };
    const t6 = { ...t1, task_name: 't6', group_name: 'faa' };

    beforeEach(async () => {
      await axios.post(`${TEST_SERVER_ROOT}/api/v1/cron/`, t1);
      await axios.post(`${TEST_SERVER_ROOT}/api/v1/cron/`, t2);
      await axios.post(`${TEST_SERVER_ROOT}/api/v1/cron/`, t3);
      await axios.post(`${TEST_SERVER_ROOT}/api/v1/cron/`, t4);
      await axios.post(`${TEST_SERVER_ROOT}/api/v1/cron/`, t5);
      await axios.post(`${TEST_SERVER_ROOT}/api/v1/cron/`, t6);
    });

    it('should fetch all the available tasks', async () => {
      const r1 = await axios.get(`${TEST_SERVER_ROOT}/api/v1/cron/`);
      expect(r1.data.success).toBe(true);
      expect(r1.data.data.tasks).toHaveLength(6);
    });

    it('should fetch a limited amount of tasks', async () => {
      const r1 = await axios.get(`${TEST_SERVER_ROOT}/api/v1/cron/?limit=1`);
      expect(r1.data.success).toBe(true);
      expect(r1.data.data.tasks).toHaveLength(1);
    });

    it('should fetch tasks by group', async () => {
      const r1 = await axios.get(`${TEST_SERVER_ROOT}/api/v1/cron/?group=foo`);
      expect(r1.data.success).toBe(true);
      expect(r1.data.data.tasks).toHaveLength(3);
    });
  });
});
