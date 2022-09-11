import { makeStyles } from "@mui/styles"
import { darken } from '@mui/material'

const useStyles = makeStyles((theme) => {
    return {
        footer: {
            borderTop: '0.5px solid #ddd',
            padding: '0% 12%',
            width: '100vw',
            backgroundColor: '#ffffff', //darken('#062e03', 0.82),
       //     border: '1px solid #eee',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        },
        contentContainer: {
            display: 'flex', 
            alignItems: 'flex-start', 
            justifyContent: 'space-between', 
            flex: 1 
        },
        link: {
            cursor: 'pointer',
            '&:hover': {
                color: 'rgb(147, 227, 178)'
            },
        },
        column: {}
    }
})

export default useStyles