import { createStyles, makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) =>
  createStyles({
    toolbar: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
     border: 'none !important',
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
    },
    row: {
      display: 'flex',
      alignItems: 'center',
    },
    identityBox: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      width: 'auto',
      padding: '0px 8px'
    },
    column: {
      display: 'flex',
      flexDirection: 'column',
    },
    blockie: {
      borderRadius: 999
    },
    address: {
      width: 120, 
      overflowX: 'hidden', 
      textOverflow: 'ellipsis'
    },
    marketContentContainer: {
      width: '100%', display: 'flex', flexDirection: 'column'
    },
    clickableBrand: {
      cursor: 'pointer'
    },
    defaultMarketLink: {
      '&:hover': {
        color: '#4CAF50'
      }
    }
  }),
);

export default useStyles;