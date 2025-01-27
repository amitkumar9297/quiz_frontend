import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { login } from '../../store/reducers/authReducer';
import { Box, TextField, Button, Typography, Container, CircularProgress, Alert } from '@mui/material';
import { useLoginUserMutation } from '../../services/api'; // RTK Query hook

interface LoginFormInputs {
  email: string;
  password: string;
}

const loginSchema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginUser, { isLoading, isError, error }] = useLoginUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const response = await loginUser(data).unwrap();
      const { accessToken, refreshToken, userId } = response.token;

      // Dispatch login action to Redux
      dispatch(login({ accessToken, refreshToken, userId }));

      alert('Login successful!');
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <Container maxWidth="xs" style={{ marginTop: '2rem' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '2rem',
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography component="h1" variant="h5" gutterBottom>
          Login
        </Typography>

        {isError && (
          <Alert severity="error" sx={{ width: '100%', marginBottom: '1rem' }}>
            {(error as any)?.data?.message || 'Login failed. Please try again.'}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ width: '100%' }}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            variant="outlined"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ marginTop: '1.5rem', padding: '0.75rem' }}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading ? 'Logging In...' : 'Login'}
          </Button>
          <Typography variant="body2" align="center" sx={{ marginTop: '1rem' }}>
            Don’t know your password?{' '}
            <a href="/forgot" style={{ color: 'blue' }}>
              forgot password
            </a>
          </Typography>
          <Typography variant="body2" align="center" sx={{ marginTop: '1rem' }}>
            Don’t have an account?{' '}
            <a href="/signup" style={{ color: 'blue' }}>
              Sign up
            </a>
          </Typography>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
