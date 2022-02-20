import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => {
  return {
    root: {
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      flexDirection: 'column',
      overflow: 'auto',
      backgroundColor: '#fff',
    },
    heading: {
      fontWeight: '500',
      color: 'rgba(33, 33, 33, .85)',
    },
    container: {
      backgroundColor: '#fafafa',
      width: '100%',
    },
    buttonContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    gridContainer: {
      padding: '1% 4%',
    },
    containerCentered: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }
  }
})

export { useStyles }
