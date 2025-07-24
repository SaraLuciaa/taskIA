import React from 'react';
import { Box } from '@mui/material';
import theme from '../theme';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box sx={{
    minHeight: '100vh',
    minWidth: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: theme.palette.background.default,
    p: { xs: 1, sm: 2 },
  }}>
    {children}
  </Box>
);

export default AuthLayout; 