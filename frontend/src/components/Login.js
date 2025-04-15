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
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === 'jason@gmail.com' && password === 'oldmonk') {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      {/* Enhanced Header */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{
          background: 'linear-gradient(to right, #0C47A0, #000000)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <Toolbar sx={{ py: 1.5 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '0.5px',
              textShadow: '0px 2px 4px rgba(0,0,0,0.3)',
              fontFamily: '"Poppins", "Roboto", "Arial", sans-serif',
              ml: 2
            }}
          >
            Insured Hub
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container component="main" maxWidth="lg" sx={{ flex: 1, py: 8 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            mb: 6,
          }}
        >
          <Typography variant="h1" gutterBottom>
            Streamline Your Insurance Management
          </Typography>
          <Typography variant="subtitle1" sx={{ maxWidth: 600 }}>
            Automate lead generation, policy management, and client communication—all in one place.
          </Typography>
        </Box>

        {/* Login Form */}
        <Container maxWidth="xs">
          <Paper
            elevation={3}
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5" gutterBottom>
              Welcome Back
            </Typography>
            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {error}
              </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
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
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Forgot password? Contact your administrator
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Container>

        {/* Feature Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 4,
            mt: 8,
          }}
        >
          {[
            {
              title: 'Lead Management',
              description: 'Track and convert insurance leads efficiently.',
            },
            {
              title: 'Master Data',
              description: 'Generate and enhance policy proposals automatically.',
            },
            {
              title: 'Client Coordination',
              description: 'Manage client communications seamlessly.',
            },
            {
              title: 'Real-Time Tracking',
              description: 'Monitor policy status and feedback in real time.',
            },
          ].map((feature, index) => (
            <Paper
              key={index}
              sx={{
                p: 3,
                textAlign: 'center',
                bgcolor: 'background.paper',
              }}
            >
              <Typography variant="h6" gutterBottom>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export default Login; 