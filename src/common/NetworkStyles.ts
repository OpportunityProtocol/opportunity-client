import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => {
  return {
    container: {
      width: '100%',
      height: '100%',
      backgroundColor: '#fff',
    },
    blockie: {
      borderRadius: 999, left: '35%', position: 'absolute', top: 52
    },
    productCard: {
      '&:hover': {
        cursor: 'pointer',
        boxShadow: '0px 6px 6px -3px #ccc, 0px 10px 14px 1px #ccc, 0px 4px 18px 3px #ccc',
      },
    },
    connectionCard: {
      '&:hover': {
        cursor: 'pointer',
        boxShadow: '0px 6px 6px -3px #ccc, 0px 10px 14px 1px #ccc, 0px 4px 18px 3px #ccc',
      },
    },
    button: {
      display: 'none',
      '&:hover': {
        display: 'flex'
      }
    }
  }
})

export { useStyles }
export default ''