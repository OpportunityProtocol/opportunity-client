import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
    root: {
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        flexDirection: 'column',
        overflow: 'auto',
        backgroundColor: '#fff'
    },
    heading: {
        fontWeight:  '500',
        color: 'rgba(33, 33, 33, .85)'
    },
}))
