import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => {
  return {
    marketTitle: {
      fontWeight: 'bold',
    },
    primaryContentContainer: {
      '&:hover': {
        color: 'rgb(98, 202, 161)'
      }
    }
  }
})

export { useStyles }
