import { Theme } from '@mui/material';
import { createStyles, DefaultTheme, makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme : Theme) => {
return {
    container: {
        marginTop: '4%',
    },
    boxContainer: {
        padding: '1% 3%', height: 'calc(100vh - 120px)', backgroundColor: 'red'
    },
    selectedCard: {
        border: '5px solid #A5D6A7'
    },
    cardContent: {
        padding: 15
    },
    marketTypeCard: {
        width: 220,
        height: 180,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textField: {
        width: 400,
        border: '1px solid #eee',
        backgroundColor: '#fafafa',
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: 'medium'
    },
    sectionSubheader: {
        fontSize: 13,
        fontWeight: 'regular',
        color: '#212121'
    },
    subSectionHeader: {
        fontWeight: '600',
        color: 'rgba(33, 33, 33, .85)',
        fontSize: 15
    },
    columnCenter: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    blockie: {
        borderRadius: 20
    },
    chatArea: {
        width: '100%', height: 400, borderRadius: 10,
    },
    inputContainer: {
        display: 'flex', bgcolor: '#fafafa'
    },
    inputBase: {
        width: '100%', padding: 1
    },
    containerCentered: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    fileContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    link: {
        color: 'rgb(54, 119, 74)',
        cursor: 'pointer'
    },
    marginBottom: {
        marginBottom: theme.spacing(2)
    },
    graphCard: {
        backgroundColor: 'transparent !important', 
        height: 'auto',
    },    purchaseIconSmall: {
        color: 'red'
    },
    li: {
        padding: '0px !important'
      //  fontSize: 15
    },
    graphButton: {
       color: 'red'
    },
    info: {
        marginRight: 12,
      },
      avatar: {
        borderRadius: 8,
        backgroundColor: '#495869'
      },
      overline: {
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: '#8D9CAD',
      },
      name: {
        //fontSize: 14,
        fontWeight: 500,
        color: '#495869',
      },

      tableCell: {
      //  borderBottomWidth: 0, 
        //borderBottom: 'none'
    },
    tableRow: {
    background: theme.palette.background.paper,
    borderRadius: 8,
    //boxShadow: '0px 5px 5px -3px rgba(240, 239, 241, 0.8), 0px 8px 10px 1px rgba(240, 239, 241, 0.5),0px 3px 14px 2px rgba(240, 239, 241, 0.2)',
    },
    tableCellText: {
        color: 'black'
    },
    mainContainer: {
        marginTop: 20,
        backgroundColor: '#fff !important'
    },
    }
});

export { useStyles }