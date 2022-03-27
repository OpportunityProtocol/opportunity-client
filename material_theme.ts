import { createTheme } from '@mui/material/styles';


  const theme = createTheme({  
    palette: {
      divider: '#eee',
      secondary: {
        light: 'rgb(147, 228, 178)',
        main: '#65d386',
        dark: 'rgb(54, 119, 74)'
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
            border: '1px solid #ddd',
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