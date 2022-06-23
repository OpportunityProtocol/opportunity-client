import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme: Theme) => {
    return {
        paper: {
           // marginBottom: theme.spacing(2),
            padding: '8px 4px',
            display: 'flex',
            flex: 1,
            
            alignItems: 'center',
            backgroundColor: 'transparent !important',
        },
        iconButton: {
            padding: '10px'
        }
    }
})

export { useStyles }
export default ''