import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => {
  return {
    marketTitle: {
      fontWeight: 'bold',
    },
    primaryContentContainer: {
      '&:hover': {
        color: '#4CAF50'
      }
    }
  }
})

export { useStyles }
