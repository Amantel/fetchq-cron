import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AppLayout from '../layouts/AppLayout';
import ConfigTask from '../components/ConfigTask';
import RoutedButton from '../components/RoutedButton';
import { usePost } from '../state/use-post';

const defaultConfig = {
  group_name: 'foo',
  task_name: 'a001',
  schedule: {
    method: 'delay',
    value: '1s',
  },
  action: {
    method: 'webhook',
    request: {
      type: 'rest',
      method: 'GET',
      url:
        'https://8080-bef24188-530f-4579-84d5-61f22d7b9334.ws-eu01.gitpod.io/ping',
      headers: [],
      body: {},
    },
  },
  payload: {},
};

const CreateTask = () => {
  const [{ data }, { send }] = usePost('/api/v1/cron/');
  const [config, setConfig] = useState(defaultConfig);

  const handleSubmit = evt => {
    evt.preventDefault();
    send(config);
  };

  // TODO: show some form of confirmation message before redirecting
  if (data) {
    return <Redirect to="/" />;
  }

  return (
    <AppLayout>
      <Typography variant="h4">Create new task:</Typography>
      <form onSubmit={handleSubmit}>
        <ConfigTask
          value={config}
          onChange={(evt, value) => setConfig(value)}
        />
        <Button type="submit" color="primary" variant="contained">
          Save
        </Button>
        <RoutedButton to="/">Cancel</RoutedButton>
      </form>
    </AppLayout>
  );
};

export default React.memo(CreateTask);
