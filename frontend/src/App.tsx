import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Login from './components/Login';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0C47A0', // Deep blue
    },
    secondary: {
      main: '#000000', // Black
    },
    background: {
      default: '#000000', // Black background
      paper: '#111111', // Slightly lighter black for cards
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
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Login />
    </ThemeProvider>
  );
}

export default App;
