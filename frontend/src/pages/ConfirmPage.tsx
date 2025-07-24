import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Typography, Alert, Box, Link } from '@mui/material';
import AuthLayout from '../components/AuthLayout';
import theme from '../theme';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ConfirmPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = (location.state as any)?.email || '';
  const [resent, setResent] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleResend = async () => {
    setError('');
    setResent(false);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'dummyPassword123!' }),
      });
      if (!res.ok) throw new Error('No se pudo reenviar el correo.');
      setResent(true);
    } catch (err: any) {
      setError(err.message);
    }
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
          ¡Confirma tu correo!
        </Typography>
        <Typography variant="body1" color={theme.palette.text.secondary} sx={{ fontFamily: 'inherit', maxWidth: 340, textAlign: 'center', mb: 3 }}>
          Te enviamos un correo a <b>{email}</b>. Haz clic en el enlace para activar tu cuenta.
        </Typography>
        <Button onClick={handleResend} disabled={resent} variant="contained" color="primary" sx={{ mb: 2, fontWeight: 700, borderRadius: 2 }}>
          Reenviar correo
        </Button>
        {resent && <Alert severity="success">Correo reenviado. Revisa tu bandeja de entrada.</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        <Link href="/login" underline="hover" color={theme.palette.secondary.main} fontWeight={700} fontSize={16} sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
          Ir al login
        </Link>
      </Box>
    </AuthLayout>
  );
};

export default ConfirmPage; 