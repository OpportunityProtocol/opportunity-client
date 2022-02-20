import { createStyles, makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) =>
  createStyles({
    toolbar: {
      width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
    },
    flexRowEnd: {
      display: 'flex', alignItems: 'center', justifyContent: 'flex-end'
    },
    radio: {
      paddingBottom: '0px !important',
      marginBottom: '0px !important',
      paddingTop: '0px !important',
      marginTop: '0px !important',
    },
    formControlLabel: {
      padding: '0px !important', 
      margin: '5px 0px !important'
    }
  }),
);

  export default useStyles; 