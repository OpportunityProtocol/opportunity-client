import { makeStyles } from "@mui/styles";
import { alpha } from "@mui/system";

const useStyles = makeStyles(theme => ({
    card: { 
        '&:hover': {
        cursor: 'pointer',
        boxShadow:
          '0px 5px 5px -3px rgba(240, 239, 241, 0.8), 0px 8px 10px 1px rgba(240, 239, 241, 0.5),0px 3px 14px 2px rgba(240, 239, 241, 0.2)',
      },

    },
    root: {
        width: 'auto',
        padding: 10,
        margin: '5px 0px',
        borderWidth: 1,
        borderColor: '#eee',

    },
    blockie: {
        borderRadius: 20
    },
    descriptionContainer: {
        minHeight: 100,
        padding: '10px 0px'
    },
    description: {
        maxHeight: 1,
        fontWeight: '700'
    },
    chipTag: {
        color: theme.palette.primary.light,
        fontSize: 8,
        marginRight: '5px'
    },
    employerName: {
        fontSize: 14
    },
    relationshipTitle: {
        fontSize: 17,
        fontWeight: '700'
    },
    dateCreated: {
        fontSize: 12,
        color: 'rgb(159, 159, 159)'
    },
    row: {
        display: 'flex',
        alignItems: 'center'
    },
    viewButton: {
        visibility: 'hidden',
        '&:hover': {
            visibility: 'visible'
        },
    }
}))

export { useStyles }