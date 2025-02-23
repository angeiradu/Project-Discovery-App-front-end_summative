import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Container, Box, Paper, Avatar, Snackbar, Link } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [messageType, setMessageType] = useState<'success' | 'error'>('error');

  // Initialize navigate
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password,
      });
      console.log(response);

      // Store the token in localStorage
      localStorage.setItem('authToken', response.data.data.token);

      // Handle successful login here
      console.log('Login successful:', response.data);

      setMessageType('success');
      setOpenSnackbar(true);

      // Navigate to the home page after successful login
      navigate('/home');

    } catch (err: any) {
      setError('Login failed. Please check your credentials.');
      setMessageType('error');
      setOpenSnackbar(true);
      console.error('Error during login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          minHeight: '100vh',
          padding: 2,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            width: '100%',
            maxWidth: 400,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: '#1976d2', width: 60, height: 60 }}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            Log In
          </Typography>

          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={() => setOpenSnackbar(false)}
          >
            <Alert
              onClose={() => setOpenSnackbar(false)}
              severity={messageType}
              sx={{ width: '100%' }}
            >
              {messageType === 'success' ? 'Login successful!' : error}
            </Alert>
          </Snackbar>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              sx={{
                marginBottom: 2,
                backgroundColor: '#f3f3f3',
                borderRadius: 2,
              }}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              sx={{
                marginBottom: 2,
                backgroundColor: '#f3f3f3',
                borderRadius: 2,
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                padding: '14px',
                fontSize: '16px',
                fontWeight: 'bold',
                marginTop: 2,
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </Button>

            <Typography variant="body2" sx={{ textAlign: 'center', marginTop: 2 }}>
              Don't have an account?{' '}
              <Link href="/signup" sx={{ color: '#1976d2', textDecoration: 'none' }}>
                Sign Up
              </Link>
            </Typography>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;