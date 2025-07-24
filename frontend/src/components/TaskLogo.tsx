import React from 'react';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { Box } from '@mui/material';

const TaskLogo: React.FC = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
    <TaskAltIcon sx={{ fontSize: 50, color: '#f76b1c', filter: 'drop-shadow(0 2px 8px #f5d365)' }} />
  </Box>
);

export default TaskLogo; 