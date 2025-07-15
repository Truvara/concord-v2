'use client';

import { IconButton, useTheme } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useContext } from 'react';
import { ColorModeContext } from '@contexts/color-mode';

type ColorMode = 'light' | 'dark';

export const DarkModeToggle = () => {
  const theme = useTheme();
  const { mode, setMode } = useContext(ColorModeContext) as {
    mode: ColorMode;
    setMode: (mode: ColorMode) => void;
  };

  return (
    <IconButton
      sx={{ ml: 1 }}
      onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
      color="inherit"
    >
      {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}; 