import { createTheme, type ThemeOptions } from '@mui/material/styles';

export const theme = createTheme({
  // @see https://mui.com/material-ui/customization/color/#picking-colors
  cssVariables: true,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  },
  palette: {
    primary: {
      main: '#212636',
      contrastText: '#FFFFFF'
    },
    error: {
      main: '#d32f2f',
      light: '#FF671B'
    },
    success: {
      main: '#2E7D32',
      light: '#53E3B8',
      contrastText: '#FFFFFF'
    },
    background: {
      default: '#FBFBFC',
      card: '#F0F2F8',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#212636',
      secondary: '#646774',
      disabled: '#646774'
    },
    divider: '#D3D6E0'
  },
  shape: {
    borderRadius: 9
  },
  spacing: 10,
  typography: {
    fontFamily: 'var(--font-nunito), Arial, sans-serif',
    h1: {
      fontFamily: 'var(--font-vg5000), Arial, sans-serif',
      fontWeight: 400,
      fontSize: '1.9rem'
    },
    h2: {
      fontFamily: 'var(--font-vg5000), Arial, sans-serif',
      fontWeight: 400
    },
    h3: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: '0.1rem'
    },
    h4: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      textTransform: 'capitalize',
      letterSpacing: '0.05rem'
    },
    h5: {
      fontSize: '0.9rem',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: '0.1rem'
    },
    subtitle1: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: '0.05rem'
    },
    body1: {
      fontSize: '1.5rem',
      letterSpacing: '0.5px'
    },
    body2: {
      fontSize: '1.2rem',
      letterSpacing: '0.5px'
    }
  }
});

export const Section = {
  FabLab: 'fabLab',
  OpenBadge: 'openBadge',
  Event: 'event',
  User: 'user',
  Support: 'support',
  Admin: 'admin',
  Repair: 'repair'
} as const;

export type Section = (typeof Section)[keyof typeof Section];

const sectionSecondary: Record<Section, ThemeOptions> = {
  [Section.FabLab]: {
    palette: {
      secondary: {
        light: '#CFD5E9',
        main: '#9DA5BF',
        dark: '#747FA4',
        contrastText: '#FFFFFF'
      }
    }
  },
  [Section.OpenBadge]: {
    palette: {
      secondary: {
        light: '#988EFF',
        main: '#6D61EB',
        dark: '#4D41D2',
        contrastText: '#FFFFFF'
      }
    }
  },
  [Section.Event]: {
    palette: {
      secondary: {
        light: '#6C5DFF',
        main: '#4D3EE5',
        dark: '#2313C7',
        contrastText: '#FFFFFF'
      }
    }
  },
  [Section.User]: {
    palette: {
      secondary: {
        light: '#70A5FB',
        main: '#317BF4',
        dark: '#1B63D8',
        contrastText: '#FFFFFF'
      }
    }
  },
  [Section.Support]: {
    palette: {
      secondary: {
        light: '#74736F',
        main: '#2F2D28',
        dark: '#22201B',
        contrastText: '#FFFFFF'
      }
    }
  },
  [Section.Admin]: {
    palette: {
      secondary: {
        light: '#48506B',
        main: '#191E2D',
        dark: '#080B14',
        contrastText: '#FFFFFF'
      }
    }
  },
  [Section.Repair]: {
    palette: {
      secondary: {
        light: '#FFAC87',
        main: '#FF7233',
        dark: '#E95818',
        contrastText: '#FFFFFF'
      }
    }
  }
};

export const sectionThemes: Record<Section, typeof theme> = Object.fromEntries(
  (Object.values(Section) as Section[]).map((section) => [section, createTheme(theme, sectionSecondary[section])])
) as Record<Section, typeof theme>;
