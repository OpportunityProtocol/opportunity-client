import { createTheme } from '@mui/material/styles';


  const theme = createTheme({  
    palette: {
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
  });

  export default createTheme(theme)