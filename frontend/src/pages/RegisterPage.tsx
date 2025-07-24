import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Alert, Box, Divider, Link } from '@mui/material';
import AuthLayout from '../components/AuthLayout';
import theme from '../theme';

const API_URL = import.meta.env.VITE_API_URL;

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error en el registro');
      setSuccess(data.message);
      setTimeout(() => navigate('/confirm', { state: { email } }), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Box sx={{
        width: { xs: '98vw', sm: 420, md: 900 },
        minHeight: { xs: 420, md: 420 },
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        borderRadius: 24,
        boxShadow: 'none',
        overflow: 'visible',
        background: 'none',
        fontFamily: 'Inter, Roboto, Arial, sans-serif',
        p: { xs: 1, sm: 2 },
      }}>
        {/* Columna izquierda: Frase */}
        <Box flex={1} p={{ xs: 2, md: 4 }} display="flex" flexDirection="column" justifyContent="center" alignItems="flex-start" sx={{ background: '#F3E5F5', borderRadius: { md: '24px', xs: '24px 24px 0 0' }, minHeight: { md: 420, xs: 320 }, mr: { md: 0, xs: 0 } }}>
          <Typography variant="h3" fontWeight={900} mb={2} color={theme.palette.primary.main} sx={{ fontFamily: 'inherit' }}>
            TaskIA
          </Typography>
          <Typography variant="h5" fontWeight={700} mb={2} color={theme.palette.text.primary} sx={{ fontFamily: 'inherit' }}>
            ¡Crea tu cuenta!
          </Typography>
          <Typography variant="body1" color={theme.palette.text.secondary} sx={{ fontFamily: 'inherit', maxWidth: 340 }}>
            Regístrate para organizar, priorizar y resolver tus tareas con inteligencia.
          </Typography>
        </Box>
        {/* Columna derecha: Formulario */}
        <Box flex={1} p={{ xs: 2, md: 4 }} display="flex" flexDirection="column" justifyContent="center" alignItems="center" sx={{ background: '#fff', borderRadius: { md: '24px', xs: '0 0 24px 24px' }, minHeight: { md: 420, xs: 320 }, boxShadow: 'none', ml: { md: 0, xs: 0 } }}>
          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 340 }}>
            <TextField
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
              autoFocus
              size="medium"
              sx={{ mb: 2, borderRadius: 2, background: '#F3E5F5' }}
              InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
            />
            <TextField
              label="Contraseña"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
              size="medium"
              sx={{ mb: 2, borderRadius: 2, background: '#F3E5F5' }}
              InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ py: 1.5, fontWeight: 700, borderRadius: 2, fontSize: 18, background: theme.palette.primary.main, color: '#fff', mt: 2, boxShadow: 'none' }}
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </Button>
            <Box mt={2} textAlign="center">
              <Link href="/login" underline="hover" color={theme.palette.secondary.main} fontWeight={700} fontSize={16} sx={{ display: 'block' }}>
                ¿Ya tienes cuenta? Inicia sesión
              </Link>
            </Box>
          </form>
          {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2, width: '100%' }}>{success}</Alert>}
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default RegisterPage; 