import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => {
  return {
    root: {
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      flexDirection: 'column',
      overflow: 'auto',
      padding: '1% 4%',
      backgroundColor: '#fbfbfd',
    },
    heading: {
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
    containerCentered: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      marginTop: '4%',
    },
    selectedCard: {
      border: '5px solid #A5D6A7',
    },
    cardContent: {
      padding: 15,
    },
    marketTypeCard: {
      width: 220,
      height: 180,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    textField: {
      width: 400,
      border: '1px solid #eee',
      backgroundColor: '#fafafa',
    },
    sectionHeader: {
      fontSize: 20,
      fontWeight: 'medium',
    },
    sectionSubheader: {
      fontSize: 13,
      fontWeight: 'regular',
      color: '#212121',
    },
    subSectionHeader: {
      fontWeight: '600',
      color: 'rgba(33, 33, 33, .85)',
      fontSize: 15,
    },
    columnCenter: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    searchContainer: {
      width: 600,
      padding: 10,
      borderRadius: 20,
      border: '1px solid #eee',
      elevation: 0,
      display: 'flex',
      alignItems: 'center',
    },
  }
})

export { useStyles }
