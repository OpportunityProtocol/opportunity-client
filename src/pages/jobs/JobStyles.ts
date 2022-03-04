import { makeStyles } from '@mui/styles'

const drawerWidth = 233

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: '#fbfbfd'
    },
    summaryItem: {
        width: 300,
        height: 150,
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        padding: 10
    },
    buttonPaper: {
        color: 'white'
    },
    heading: {
        padding: '10px 5px'
    },
    fab: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        marginRight: 16,
        marginBottom: 16
    },
    containerCentered: {
        padding: '8px 0px',
        backgroundColor: '#fff',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      container: {
        padding: '1% 4%',  width: '100%'
    },
}))

export { useStyles }
