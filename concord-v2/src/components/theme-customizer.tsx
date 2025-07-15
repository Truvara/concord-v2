'use client';

import { createTheme, ThemeProvider } from '@mui/material';
import type { PaletteMode, Theme } from '@mui/material';
import { ReactNode, useMemo } from 'react';
import { useContext } from 'react';
import { ColorModeContext } from '@contexts/color-mode';

export function ThemeCustomizer({ children }: { children: ReactNode }) {
  const { mode } = useContext(ColorModeContext);

  const theme = useMemo(() => createTheme({
    palette: {
      mode: mode as PaletteMode,
      ...(mode === 'dark' ? {
        background: {
          default: '#1a1a1a',
          paper: '#2d2d2d',
        },
        text: {
          primary: '#ffffff',
          secondary: 'rgba(255, 255, 255, 0.7)',
        },
      } : {
        background: {
          default: '#f5f5f5',
          paper: '#ffffff',
        },
      }),
    },
    typography: {
      fontFamily: [
        'DM Sans',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      h1: {
        fontWeight: 700,
        fontSize: '2.25rem',
        lineHeight: 1.2,
      },
      h2: {
        fontWeight: 600,
        fontSize: '1.875rem',
        lineHeight: 1.2,
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: 1.2,
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.2,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.5,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            fontFamily: 'DM Sans',
            fontWeight: 600,
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            fontFamily: 'DM Sans',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            width: '100%',
          },
        },
      },
      MuiList: {
        styleOverrides: {
          root: {
            width: '100%',
          },
        },
      },
    },
  }) as Theme, [mode]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
} 