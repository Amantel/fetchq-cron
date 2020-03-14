import React from 'react';
import PropTypes from 'prop-types';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import DisplayDate from '../components/DisplayDate';
import { taskShape } from '../data-types/task';

const TasksListTable = ({ items }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Task</TableCell>
            <TableCell align="right">Iterations</TableCell>
            <TableCell align="right">Last Run</TableCell>
            <TableCell align="right">Next Run</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map(task => {
            const {
              subject,
              groupName,
              taskName,
              iterations,
              nextIteration,
              lastIteration,
            } = task;
            return (
              <TableRow key={subject}>
                <TableCell>
                  {groupName}/{taskName}
                </TableCell>
                <TableCell align="right">{iterations}</TableCell>
                <TableCell align="right">
                  <DisplayDate date={lastIteration} refreshInterval={500} />
                </TableCell>
                <TableCell align="right">
                  <DisplayDate date={nextIteration} refreshInterval={500} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

TasksListTable.propTypes = {
  items: PropTypes.arrayOf(taskShape),
};

export default React.memo(TasksListTable);
