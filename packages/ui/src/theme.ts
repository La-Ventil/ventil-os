import { createTheme } from '@mui/material/styles';

export let theme = createTheme({
  // @see https://mui.com/material-ui/customization/color/#picking-colors
  palette: {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff'
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000'
    }
  }
});

theme = createTheme(theme, {
  palette: {
    info: {
      main: theme.palette.secondary.main
    }
  },
  typography: {
    fontFamily: 'Raleway, Arial',
    h3: {
      fontSize: '1.2rem',
      '@media (min-width:600px)': {
        fontSize: '1.5rem'
      },
      [theme.breakpoints.up('md')]: {
        fontSize: '2.4rem'
      }
    }
  }
});
