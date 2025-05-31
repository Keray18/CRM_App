import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
  AppBar,
  Toolbar,
  Alert,
  Grid,
  useTheme,
  useMediaQuery,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff, Business, Security, Speed, GroupAdd } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import authHeader from '../services/authHeader';
import { API_URL } from '../config/config';

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post(`${API_URL}api/auth/login`, {
        email,
        password
      });

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('token', data.token);
      // Set userRole based on backend response (if available)
      if (data.role === 'admin' || data.isAdmin || data.employee?.position === 'Admin') {
        localStorage.setItem('userRole', 'admin');
        navigate('/dashboard');
      } else {
        localStorage.setItem('userRole', 'employee');
        navigate('/emp-dashboard');
      }
      localStorage.setItem('userData', JSON.stringify(data));
      localStorage.setItem('employeeName', data.name || '');
      if (data.employee && data.employee.id) {
        localStorage.setItem('employeeId', data.employee.id);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <Business sx={{ fontSize: 48, color: '#1976D2' }} />,
      title: 'Lead Management',
      description: 'Track and convert leads efficiently',
      gradient: 'linear-gradient(135deg, #0C47A0 0%, #1976D2 100%)'
    },
    {
      icon: <Security sx={{ fontSize: 48, color: '#2196F3' }} />,
      title: 'Master Data',
      description: 'Generate proposals automatically',
      gradient: 'linear-gradient(135deg, #1976D2 0%, #2196F3 100%)'
    },
    {
      icon: <GroupAdd sx={{ fontSize: 48, color: '#42A5F5' }} />,
      title: 'Client Coordination',
      description: 'Manage communications seamlessly',
      gradient: 'linear-gradient(135deg, #2196F3 0%, #42A5F5 100%)'
    },
    {
      icon: <Speed sx={{ fontSize: 48, color: '#64B5F6' }} />,
      title: 'Real-Time Tracking',
      description: 'Monitor policy status instantly',
      gradient: 'linear-gradient(135deg, #42A5F5 0%, #64B5F6 100%)'
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #0061FF 0%, #0044B3 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
          zIndex: 0,
        }
      }}
    >
      <AppBar 
        position="static" 
        elevation={0}
        sx={{
          background: 'transparent',
          borderBottom: 'none',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Toolbar>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '0.5px',
              fontSize: '1.5rem',
            }}
          >
            Insured Hub
          </Typography>
        </Toolbar>
      </AppBar>

      <Container 
        maxWidth="lg" 
        sx={{ 
          mt: 8, 
          mb: 4, 
          flex: 1,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12} sm={8} md={5} lg={4}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, sm: 4 },
                borderRadius: '20px',
                background: '#fff',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              }}
            >
              <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: '#0052CC',
                    mb: 1,
                    fontSize: '2rem',
                  }}
                >
                  Welcome Back
                </Typography>
              </Box>

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3,
                    borderRadius: '10px',
                  }}
                >
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  placeholder="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      height: '56px',
                      backgroundColor: '#0052CC15',
                      borderRadius: '12px',
                      '& fieldset': {
                        borderColor: 'transparent',
                      },
                      '&:hover fieldset': {
                        borderColor: '#0052CC',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#0052CC',
                      },
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '1rem',
                      color: '#2C3E50',
                    },
                    '& .MuiInputLabel-root': {
                      color: '#2C3E50',
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  placeholder="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: showPassword ? '#0052CC' : '#94A3B8' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      height: '56px',
                      backgroundColor: '#0052CC15',
                      borderRadius: '12px',
                      '& fieldset': {
                        borderColor: 'transparent',
                      },
                      '&:hover fieldset': {
                        borderColor: '#0052CC',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#0052CC',
                      },
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '1rem',
                      color: '#2C3E50',
                    },
                    '& .MuiInputLabel-root': {
                      color: '#2C3E50',
                    },
                  }}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      sx={{
                        color: '#0052CC',
                        '&.Mui-checked': {
                          color: '#0052CC',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ color: '#64748B', fontWeight: 500 }}>
                      Remember me
                    </Typography>
                  }
                  sx={{ mt: 1, mb: 2 }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    py: 2,
                    borderRadius: '12px',
                    fontSize: '1rem',
                    textTransform: 'none',
                    fontWeight: 600,
                    backgroundColor: '#0052CC',
                    '&:hover': {
                      backgroundColor: '#0043A4',
                    },
                    boxShadow: 'none',
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={7} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ pl: { md: 6 } }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: '#fff',
                  mb: 4,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  lineHeight: 1.2,
                }}
              >
                Insurance Management
              </Typography>

              <Grid container spacing={3}>
                {features.map((feature, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        borderRadius: '16px',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          backgroundColor: '#E8F0FE',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                        }}
                      >
                        {React.cloneElement(feature.icon, { 
                          sx: { 
                            fontSize: 24, 
                            color: '#0052CC',
                          } 
                        })}
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: '#0052CC',
                          mb: 1,
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#64748B',
                          lineHeight: 1.5,
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Login; 