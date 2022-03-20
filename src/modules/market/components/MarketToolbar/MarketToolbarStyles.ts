import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => {
  return {
    container: {
      height: '200px',
      padding: '0% 1%',
      width: '100%',
    },
    heading: {
      fontWeight: '500',
      color: 'rgba(33, 33, 33, .85)',
    },
  }
})

export { useStyles }
