import { makeStyles } from "@mui/styles";
import { styled, alpha, ThemeProvider, ThemeOptions } from "@mui/system";
import { Theme, InputBase } from '@mui/material'
import { MouseEventHandler } from "react";
const BootstrapInput = styled(InputBase)(({ theme }: { theme?: Theme }) => ({
    'label + &': {
      marginTop: theme?.spacing(3),
    },
    '& .MuiInputBase-input': {
      borderRadius: 4,
      position: 'relative',
      backgroundColor: theme?.palette.background.paper,
      border: '1px solid #ddd',
      fontSize: 15,
      minWidth: '100%',
      fontWeight: theme?.typography.fontWeightRegular,
      padding: '10px 26px 10px 12px',
      transition: theme?.transitions.create(['border-color', 'box-shadow']),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:focus': {
        borderRadius: 4,
        border: `2px ${alpha('rgb(98, 202, 161)', .6)} solid`,
       // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        cursor: 'pointer',
      },
    },
  }));

  const useStyles = makeStyles(() => ({
   focused: {
     border: `${alpha('rgb(98, 202, 161)', .6)}`
   },
   notFocused: {

   }
  }));


  interface ITextInputProps {
    placeholder?: string,
    size?: boolean,
    selected?: false,
    value?: string | number,
    multiline?: boolean,
    rows?: number,
    width?: string | number
  }

  const TextInput : React.FunctionComponent<ITextInputProps> = ({ width, value, placeholder, size,  selected=false, multiline, rows }) => {
    const classes = useStyles()
  return (
  <BootstrapInput sx={{ width }} placeholder={placeholder}  multiline rows={rows} />
  )
  }

  export default TextInput