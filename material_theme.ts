import { createTheme } from '@mui/material/styles';


  const theme = createTheme({  
    palette: {
      primary: {
        light: '#b8e0d0',
        main: '#49A882',
        dark: '#1b4f31'
      },
      text: {
        primary: '#000000',
        secondary: 'rgba(33, 33, 33, .85)'
      },
      secondary: {
        light: '#edc2d7',
        main: '#d46290',
        dark: '#6a3c55'
      },
    },   
    typography: {
      fontFamily: [
        'Manrope',
        'sans-serif'
      ].join(','),
      button: {
        textTransform: 'none',
      }
    },
    components: {
      MuiContainer: {
        styleOverrides: {
          root: {
            backgroundColor: 'inherit'
          }
        }
      },
      MuiTabs: {
        defaultProps: {
            indicatorColor: 'none !important',
        },
        styleOverrides: {
          root: {
            border: 'none !important'
          }
        }
      },
      MuiTypography: {
        styleOverrides: {
          button: {
            ':hover': {
              cursor: 'pointer',
            }
          }
        }
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            color: '#ddd',
            borderColor: '#ddd',
            width: '100%'
          }
        }
      },
      MuiTab: {
        styleOverrides: {
          root: {
            border: 'none !important',
            fontWeight: 'bold'
          }
        }
      },
      MuiChip: {
        styleOverrides: {
          outlined: {
            border: '1px solid #ddd'
          }
        }
      },
      MuiButton: {
        defaultProps: {
            disableElevation: true,
            disableRipple: true
        },
        styleOverrides: {
          contained: {
            color: '#fff',
          },
          text: {    
            ':hover': {
              color: '#49A882', 
            },
            fontWeight: 'bold',
            backgroundColor: 'transparent',
          },
          outlined: {
            fontSize: 12,
            fontWeight: 'bold',
            backgroundColor: 'transparent',
           // border: '1px solid #d1d1d1',
            borderRadius: 0
          },
        }
      }
    }
  });

  export default createTheme(theme)