import { createTheme } from '@mui/material/styles';


  const theme = createTheme({  
    palette: {
      primary: {
        light: '#9EEBCF',
        main: '#285C3F',
        dark: '#20373A'
      },
      text: {
        primary: '#285C3F',
      },
      secondary: {
        main: '#212121',
      },
    //  turquoise: 'rgb(98, 202, 161)'
    },   
    typography: {
      fontFamily: [
        'Manrope',
        'sans-serif'
      ].join(','),
      button: {
        textTransform: 'none',
       // color: '#4CAF50',
      }
    },
    components: {
      MuiContainer: {
        styleOverrides: {
          root: {
            backgroundColor: '#fff'
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
              color: 'rgba(255, 255, 255, 0.8)'
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
        defaultProps: {
          
        },
        styleOverrides: {
          root: {
            border: 'none !important',
            fontSize: 13,
            fontWeight: 'bold'
          }
        }
      },
      MuiChip: {
        styleOverrides: {
          root: {
           
          },
          outlined: {
            border: '1px solid #eee'
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {

          },
        }
      },
      MuiPaper: {
        styleOverrides: {
          outlined: {
            border: '1px solid #eee'
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
            fontWeight: 'bold'
          },
          outlined: {
            fontSize: 12,
            backgroundColor: 'transparent',
           // border: '1px solid #d1d1d1',
            borderRadius: 0
          },
        }
      }
    }
  });

  export default createTheme(theme)