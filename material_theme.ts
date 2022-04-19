import { createTheme } from '@mui/material/styles';


  const theme = createTheme({  
    palette: {
      divider: '#ddd',
      secondary: {
        light: 'rgb(147, 228, 178)',
        main: '#4CAF50',
        dark: 'rgb(54, 119, 74)'
      },
      primary: {
        main: '#212121',
      },
    //  turquoise: 'rgb(98, 202, 161)'
    },   
    typography: {
      button: {
        textTransform: 'none',
       // color: '#4CAF50',
      }
    },
    components: {
      MuiContainer: {
        styleOverrides: {
          root: {
            backgroundColor: '#fbfbfd'
          }
        }
      },
      MuiTab: {
        styleOverrides: {
          root: {
            fontSize: 13,
            fontWeight: 'bold'
          }
        }
      },
      MuiChip: {
        styleOverrides: {
          root: {
            border: '1px solid #ddd'
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            border: '1px solid #ddd',
          }
        }
      },
      MuiButton: {
        defaultProps: {
          
        },
        styleOverrides: {
          contained: {
            color: '#fff',
          },
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