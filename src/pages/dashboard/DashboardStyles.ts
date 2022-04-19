import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        height: 'calc(100vh - 70px)',
        backgroundColor: '#fff',
    },
    divider: {
 
        width: '100%'
    },
    quickLink: {
        color: '#aaa',
        fontSize: 12,
        fontWeight: 'light'
    },
    blockie: {
        borderRadius: 80
    },
    card: {
        boxShadow:  '0px 1px 3px 0px #eee, 0px 1px 1px 0px #eee, 0px 2px 1px -1px #eee'
    },
    marginBottom: {
        marginBottom: theme.spacing(2)
    },
    graphButton: {
        color: '#fff !important'
    },
    graphContainer: {
        height: 'auto', 
        backgroundColor: 'rgb(52, 62, 60) !important', 
        color: 'white'
    },
    tabs: {
        backgroundColor: '#fbfbfd', my: 2 
    }
}))

export { useStyles }
