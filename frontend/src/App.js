import React, { lazy, Suspense, useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline, CircularProgress, Box } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Lazy load components
const Login = lazy(() => import('./components/Login'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const EmpDashboard = lazy(() => import('./components/EmpDashboard'));

// Loading component
const LoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
    <CircularProgress />
  </Box>
);

// Memoized RequireAuth component
const RequireAuth = React.memo(({ children, role }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole');
  
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (role && userRole !== role) {
    return <Navigate to={userRole === 'admin' ? '/dashboard' : '/emp-dashboard'} />;
  }

  return children;
});

function App() {
  // Memoized theme creation moved inside App component
  const theme = useMemo(() => createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#0C47A0', 
      },
      secondary: {
        main: '#000000', 
      },
      background: {
        default: '#000000', 
        paper: '#111111', 
      },
      text: {
        primary: '#FFFFFF',
        secondary: 'rgba(255, 255, 255, 0.7)',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 600,
      },
      h5: {
        fontWeight: 500,
      },
      subtitle1: {
        color: 'rgba(255, 255, 255, 0.7)',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
          },
          containedPrimary: {
            background: '#0C47A0',
            '&:hover': {
              background: '#0A3A82',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            backgroundColor: '#111111',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.23)',
              },
              '&:hover fieldset': {
                borderColor: '#0C47A0',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#0C47A0',
              },
            },
          },
        },
      },
    },
  }), []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route 
              path="/dashboard" 
              element={
                <RequireAuth role="admin">
                  <Dashboard />
                </RequireAuth>
              } 
            />
            <Route 
              path="/emp-dashboard" 
              element={
                <RequireAuth role="employee">
                  <EmpDashboard />
                </RequireAuth>
              } 
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default React.memo(App);
