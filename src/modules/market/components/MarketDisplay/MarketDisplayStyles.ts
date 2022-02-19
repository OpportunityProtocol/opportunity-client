import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
    marketTitle: {
        fontWeight: 'bold'
    },
    card: {
        borderRadius: 5,
        '&:hover': {
            cursor: 'pointer',
            boxShadow: '0px 5px 5px -3px rgba(240, 239, 241, 0.8), 0px 8px 10px 1px rgba(240, 239, 241, 0.5),0px 3px 14px 2px rgba(240, 239, 241, 0.2)'
        }
    },
    cardRoot: {
        border: '1px solid #eee',
        background: theme.palette.background.paper,
    }
}))

export default useStyles