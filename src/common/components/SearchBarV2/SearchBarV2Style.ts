import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme: Theme) => {
    return {
        paper: {
           // marginBottom: theme.spacing(2),
            padding: '8px 4px',
            border: '1px solid #ddd',
            display: 'flex',
            flex: 1,  
            boxShadow: '0px 6px 15px -3px rgba(0,0,0,0.1)',
            height: 55,
            maxHeight: 55,
            alignItems: 'center',
        },
        iconButton: {
            padding: '10px'
        }
    }
})

export { useStyles }
export default ''