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
    }
}))

export { useStyles }
