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
            boxShadow: '0px 6px 6px -3px #ccc, 0px 10px 14px 1px #ccc, 0px 4px 18px 3px #ccc',
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