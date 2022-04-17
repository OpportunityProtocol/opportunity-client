import { makeStyles } from "@mui/styles"

const useStyles = makeStyles((theme) => {
    return {
        footer: {
            padding: '5% 12%',
            backgroundColor: '#fff',
            color: '#fff',
       //     border: '1px solid #eee',
            display: 'flex',
            flexDirection: 'column',
            width: '100%'
        },
        contentContainer: {
            display: 'flex', 
            alignItems: 'flex-start', 
            justifyContent: 'space-between', 
            flex: 1 
        },
        link: {
            cursor: 'pointer',
            color: '#212121',
            '&:hover': {
                color: 'rgb(147, 227, 178)'
            }
        }
    }
})

export default useStyles