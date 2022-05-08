import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => {
    return {
        paper: {
           // marginBottom: theme.spacing(2),
            padding: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            backgroundColor: 'transparent !important'
        },
        inputBase: {
            marginLeft: theme.spacing(1),
            flex: 1
        },
        iconButton: {
            padding: '10px'
        }
    }
})

export { useStyles }
export default ''