import React from 'react';
import { Typography, Button, Box, Link } from '@mui/material';
import AuthLayout from '../components/AuthLayout';
import theme from '../theme';

const WelcomePage: React.FC = () => {
  const email = localStorage.getItem('user_email');
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };
  return (
    <AuthLayout>
      <Box sx={{
        width: { xs: '98vw', sm: 420, md: 700 },
        minHeight: { xs: 420, md: 420 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 24,
        boxShadow: 'none',
        background: 'none',
        fontFamily: 'Inter, Roboto, Arial, sans-serif',
        p: { xs: 2, sm: 4 },
      }}>
        <Typography variant="h3" fontWeight={900} mb={2} color={theme.palette.primary.main} sx={{ fontFamily: 'inherit', textAlign: 'center' }}>
          TaskIA
        </Typography>
        <Typography variant="h5" fontWeight={700} mb={2} color={theme.palette.text.primary} sx={{ fontFamily: 'inherit', textAlign: 'center' }}>
          ¡Bienvenido!
        </Typography>
        <Typography variant="body1" color={theme.palette.text.secondary} sx={{ fontFamily: 'inherit', maxWidth: 340, textAlign: 'center', mb: 3 }}>
          Que bueno que estés de vuelta{email ? `, ${email}` : ''}.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleLogout} sx={{ fontWeight: 700, borderRadius: 2, mb: 2 }}>
          Cerrar sesión
        </Button>
      </Box>
    </AuthLayout>
  );
};

export default WelcomePage; 