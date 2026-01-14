'use client';
import { createTheme } from '@mui/material/styles';

export let theme = createTheme({
  // @see https://mui.com/material-ui/customization/color/#picking-colors
  palette: {
    primary: {
      main: '#212636',
      contrastText: '#FFFFFF'
    },
    // secondary: {
    //   fabLab: {
    //     light: '#CFD5E9',
    //     main: '#9DA5BF',
    //     dark: '#747FA4'
    //   },
    //   openBadge: {
    //     light: '#988EFF',
    //     main: '#6D61EB',
    //     dark: '#4D41D2'
    //   },
    //   event: {
    //     light: '#6C5DFF',
    //     main: '#4D3EE5',
    //     dark: '#2313C7'
    //   },
    //   user: {
    //     light: '#70A5FB',
    //     main: '#317BF4',
    //     dark: '#1B63D8'
    //   },
    //   support: {
    //     light: '#74736F',
    //     main: '#2F2D28',
    //     dark: '#22201B'
    //   },
    //   admin: {
    //     light: '#48506B',
    //     main: '#191E2D',
    //     dark: '#080B14'
    //   },
    //   repairCafe: {
    //     light: '#FFAC87',
    //     main: '#FF7233',
    //     dark: '#E95818'
    //   }
    // },
    // ui: {
    //   disabled: '#646774',
    //   disabledbackground: '#F2F3F5',
    //   separator: '#D3D6E0',
    //   gridLine: '#F5F5F8',
    //   free: '#53E3B8',
    //   occupied: '#FF671B',
    //   brand: '#317BF4',
    // },
    // userType: {
    //     intern: '#317BF4',
    //     extern: '#499F95',
    //     visitor: '#D16636',
    //     contributor: '#EABF0A',
    // },
    // background: {
    //     light: '#FFFFFF',
    //     main: '#F0F2F8',
    //     dark: '#D3D6E0'
    // }
  },
  shape: {
    borderRadius: 9,
  },
  spacing: 10,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

theme = createTheme(theme, {
  palette: {
    info: {
      main: theme.palette.secondary.main
    }
  },
  typography: {
    fontFamily: "var(--font-nunito), Arial, sans-serif",
    allVariants: {
      fontFamily: "var(--font-nunito), Arial, sans-serif",
    },
    h1: {
      fontFamily: "var(--font-vg5000)",
      fontWeight: 400,
    },
    h2: {
      fontFamily: "var(--font-vg5000)",
      fontWeight: 400,
    },
  },
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        fontFamily: "var(--font-nunito), Arial, sans-serif",
      },
    },
  },
  MuiButtonBase: {
    styleOverrides: {
      root: { fontFamily: "var(--font-nunito), Arial, sans-serif" },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: { fontFamily: "var(--font-nunito), Arial, sans-serif" },
      input: { fontFamily: "inherit" },
    },
  },
  MuiTypography: {
    styleOverrides: {
      root: { fontFamily: "var(--font-nunito), Arial, sans-serif" },
    },
  },
  MuiFormLabel: {
    styleOverrides: {
      root: { fontFamily: "var(--font-nunito), Arial, sans-serif" },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: { fontFamily: "var(--font-nunito), Arial, sans-serif" },
    },
  },
});
