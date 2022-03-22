import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => {
  return {
    container: {
      width: '100%',
      height: '100%',
      backgroundColor: '#fff',
    },
    blockie: {
      borderRadius: 20,
    },
    productCard: {
      '&:hover': {
        cursor: 'pointer',
        boxShadow:
          '0px 5px 5px -3px rgba(240, 239, 241, 0.8), 0px 8px 10px 1px rgba(240, 239, 241, 0.5),0px 3px 14px 2px rgba(240, 239, 241, 0.2)',
      },
    },
    connectionCard: {
      '&:hover': {
        cursor: 'pointer',
        boxShadow:
          '0px 5px 5px -3px rgba(240, 239, 241, 0.8), 0px 8px 10px 1px rgba(240, 239, 241, 0.5),0px 3px 14px 2px rgba(240, 239, 241, 0.2)',
      },
    },
  }
})

export { useStyles }
