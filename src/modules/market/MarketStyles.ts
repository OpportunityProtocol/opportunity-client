import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme : Theme) => {
  return {
    root: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      backgroundColor: '#fbfbfd'
  },
  marginBottom: {
      marginBottom: theme.spacing(2)
  },
  graphButton: {
      color: 'red'
  },
  avatar: {
      backgroundColor: theme.palette.primary.main,
    },
    action: {
      marginLeft: 8,
    },
  summaryItem: {
      width: 300,
      height: 150,
      backgroundColor: theme.palette.primary.main,
      color: 'white',
      padding: 10
  },
  buttonPaper: {
      color: 'white'
  },
  heading: {
      padding: '10px 5px'
  },
  fab: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      marginRight: 16,
      marginBottom: 16
  },
  containerCentered: {
      padding: '8px 0px',
      backgroundColor: '#fff',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    selectFilter: {
      width: 400, height: 70
    },
    avatarBorder: {
      border: '16px solid transparent',
      borderImage: 'linear-gradient(45deg, red, yellow)',
      borderImageSlice: 1,
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
    switchFormControlLabel: {
      color: '#a3a3a3',
      fontWeight: theme.typography.fontWeightMedium
    }
  }
})

export { useStyles }
