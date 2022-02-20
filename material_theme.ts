import { createTheme } from '@mui/material/styles';


  const theme = createTheme({  
    palette: {
      divider: '#eee',
      secondary: {
        light: '#4caf50',
        main: '#43A047',
        dark: '#388E3C'
      },
      primary: {
        main: '#212121',
      },
    },   
    typography: {
      button: {
        textTransform: 'none',
       // color: '#4caf50',
      }
    },
    components: {
      MuiChip: {
        styleOverrides: {
          root: {
            border: '1px solid #eee'
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            border: '1px solid #eee',
            '&:hover': {
              cursor: 'pointer',
              boxShadow:
                '0px 5px 5px -3px rgba(240, 239, 241, 0.8), 0px 8px 10px 1px rgba(240, 239, 241, 0.5),0px 3px 14px 2px rgba(240, 239, 241, 0.2)',
            },
          }
        }
      },
      MuiButton: {
        defaultProps: {
          
        },
        styleOverrides: {
          outlined: {
            fontSize: 12,
            backgroundColor: 'transparent',
            border: '1px solid #d1d1d1',
          },
          outlinedSizeSmall: {
            fontSize: 12,
            backgroundColor: 'transparent',
            border: '1px solid #d1d1d1',
          },
          outlinedSizeMedium: {
            fontSize: 12,
            backgroundColor: 'transparent',
            border: '1px solid #d1d1d1',
          },
          outlinedSizeLarge: {
            fontSize: 12,
            backgroundColor: 'transparent',
            border: '1px solid #d1d1d1',
          }
        }
      }
    }
  });

  export default createTheme(theme)