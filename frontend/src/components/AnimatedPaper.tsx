import React from 'react';
import { Paper } from '@mui/material';

const AnimatedPaper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Paper elevation={8} sx={{
    p: { xs: 2, sm: 4, md: 6 },
    borderRadius: 6,
    minWidth: { xs: '90vw', sm: 380 },
    maxWidth: { xs: '98vw', sm: 700 },
    width: '100%',
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    alignItems: 'stretch',
    justifyContent: 'center',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
    background: '#fff',
    overflow: 'hidden',
  }}>
    {children}
  </Paper>
);

export default AnimatedPaper; 