import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorsList from '../components/ErrorsList';
import TasksListTable from '../components/TasksListTable';
import { useTasksList } from '../state/use-tasks-list';

const TasksList = () => {
  const { isLoading, errors, tasks } = useTasksList();
  const history = useHistory();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (errors) {
    return <ErrorsList errors={errors} />;
  }

  const handleDiscloseItem = ({ groupName, taskName }) =>
    history.push(`/task/${groupName}/${taskName}/edit`);

  return (
    <div>
      <TasksListTable items={tasks} onDisclose={handleDiscloseItem} />
      <Link to="/new">Create new task</Link>
    </div>
  );
};

export default React.memo(TasksList);
